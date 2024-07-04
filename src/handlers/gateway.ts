import { Request, Response } from "express";
import { CustomSessionData } from "../types/session-types";
import { queryUserProfile } from "../services/users/profile-queries";
import generateRandomAlphanumericCode from "../modules/generate-random-string";
import { addNewOrder } from "../services/users/order-queries";
import { updateOrderPaid } from "../services/users/order-queries-2";
import { addNewNotification } from "../services/users/notifications-queries";
import { productsType, queryVendorById } from "../services/users/user-vendor-queries";
import calcTotalPrice from "../modules/calc-order-total-price";
const Flutterwave = require('flutterwave-node-v3');
const fs = require('fs');

const generateOneTimeAcc = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const orders = req.body.orders;

        if (!orders) return res.status(401).json({ message: 'request parmters are missing' })

        // query all orders from data base to check if products are valid securit reasons to get all the actual price
        const productsArray: productsType[] = [];
        const length = orders.length;

        for (let i = 0; i < length; i++) {
            // @ts-ignore
            productsArray[i] = queryUserVenorProuctsById(orders[i].productId, orders[i].vendorId)
        };

        await Promise.all(productsArray);

        for (let i = 0; i < length; i++) {
            if (!productsArray[i]) return res.status(401).json({ message: 'missig parameters' });
        };

        const totalPrice = calcTotalPrice(productsArray, orders);
        const userInfo = await queryUserProfile(userId);
        // @ts-ignoreF
        const orderId: string = generateRandomAlphanumericCode(15, false);

        const details = {
            tx_ref: generateRandomAlphanumericCode(10, false),
            amount: totalPrice,
            email: userInfo.email,
            fullname: userInfo.first_name + ' ' + userInfo.last_name,
            currency: 'NGN',
            meta: {
                order: orders,
                userId: userInfo.id,
                orderId: orderId
            },
        };
        const flw = new Flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SCRT_KEY);

        const response = await flw.Charge.bank_transfer(details); console.log('accoint detauls :', response)
        const date = new Date();

        console.error('one time account response', response);
        if (response.status === 'success') {
            const newOrder = await addNewOrder(
                userId, 'placed', orders, date, orderId,
                response.meta.authorization.transfer_account, response.meta.authorization.transfer_bank, 'Futterwave/eGurasa'
            );

            res.json({
                accountName: 'eGurasa FLw',
                accountNumber: response.meta.authorization.transfer_account,
                bankName: response.meta.authorization.transfer_bank,
                amount: response.meta.authorization.transfer_amount,
                id: newOrder.insertId,
                orderId: orderId,
            });

            const vendor = await queryVendorById(productsArray[0].vendor_id)
            // add new ordr notification
            return addNewNotification(
                userId, 'New Order Placed', `Your order from ${vendor.name} has been placed successfully.`, 'info',
                false, `/order?order_id=${orderId}&id=${newOrder.insertId}`
            );
        };
        throw 'error in creating one time account acount'
    } catch (err) {
        console.log('error in generate one time account number', err);
        res.status(500).json({ message: err });
    };
}; // end of generateOneTimeAcc



// function to responsd ti webhok event
const webhookHandler = async (req: Request, res: Response) => {
    try {
        console.log('am in webhook.......................');
        const signature = req.headers['verif-hash'];
        let payload;
        let meta;

        if (signature != process.env.FLW_H) {
            // This request isn't from Flutterwave; discard
            console.log('webhook rejectd not from a trusted source');
            return res.status(401).end();
        };

        payload = req.body;
        console.error('webhook payload', payload);

        if (payload.status !== "successful") return console.log('payment failed..... in webhook handler.......');

        const id = payload.id;
        const reference = Number(payload.txRef);
        const amount = Number(payload.amount);

        // reverify payment
        const flw = new Flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SCRT_KEY);

        const response = await flw.Transaction.verify({ id: id });
        console.error('transaction details', response);

        if (response.status !== 'success') return console.log('error occured while confirming tansacion');

        if (response.data.status !== "successful") return console.log("transaction not successfully carried out: in wallet top up");

        meta = response.data.meta
        // query to update order status
        updateOrderPaid(parseInt(meta.userId), meta.orderId);
    } catch (err) {
        console.log('error in webhook', err);
    };
};


export {
    generateOneTimeAcc,
    webhookHandler,
}