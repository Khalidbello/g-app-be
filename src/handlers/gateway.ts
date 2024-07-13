import { Request, Response } from "express";
import { CustomSessionData } from "../types/session-types";
import { queryUserProfile } from "../services/users/profile-queries";
import generateRandomAlphanumericCode from "../modules/generate-random-string";
import { addNewOrder } from "../services/users/order-queries";
import { updateOrderPaid } from "../services/users/order-queries-2";
import { addNewNotification } from "../services/users/notifications-queries";
import { productsType, queryUserVenorProuctsById, queryVendorById } from "../services/users/user-vendor-queries";
import calcTotalPrice from "../modules/calc-order-total-price";
import { queryOrderByLastFourAndUserId } from "../services/vendors/order-queries";
const Flutterwave = require('flutterwave-node-v3');
const fs = require('fs');

const generateOneTimeAcc = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const orders = req.body.orders;

        if (!orders) return res.status(401).json({ message: 'request parmters are missing' })

        // query all orders from data base to check if products are valid securit reasons to get all the actual price
        let productsArray: productsType[] = [];
        const length = orders.length;

        for (let i = 0; i < length; i++) {
            // @ts-ignore
            productsArray[i] = queryUserVenorProuctsById(orders[i].productId, orders[i].vendorId)
        };

        productsArray = await Promise.all(productsArray);

        //console.log('ordr arrry......', productsArray);


        for (let i = 0; i < length; i++) {
            if (!productsArray[i]) return res.status(401).json({ message: 'missig parameters' });
        };

        const totalPrice = calcTotalPrice(productsArray, orders);

        console.log('total price', totalPrice);
        const userInfo = await queryUserProfile(userId);
        // @ts-ignore
        let orderId: string = generateRandomAlphanumericCode(8, false);
        // @ts-ignore
        let lastFour: string = generateRandomAlphanumericCode(4, false);
        let condition = true;

        // a loop to run to ensure no user order exist with the specific last four for user
        while (condition) {
            const result = await queryOrderByLastFourAndUserId(lastFour, userId);
            if (result[0]) {
                condition = true;
            } else {
                condition = false;
                // @ts-ignore
                lastFour = generateRandomAlphanumericCode(4, false);
            };
        };

        const details = {
            tx_ref: generateRandomAlphanumericCode(10, false),
            amount: totalPrice,
            email: userInfo.email,
            fullname: userInfo.first_name + ' ' + userInfo.last_name,
            currency: 'NGN',
            meta: {
                order: orders,
                userId: userInfo.id,
                orderId: orderId,
                lastFour: lastFour
            },
        };

        const flw = new Flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SCRT_KEY);

        const response = await flw.Charge.bank_transfer(details); console.log('accoint detauls :', response)
        const date = new Date();
        const orderJson = JSON.stringify(orders);

        if (response.status === 'success') {
            const newOrder = await addNewOrder(
                userId, productsArray[0].vendor_id, productsArray[0].name, 'placed', orderJson, date, orderId, lastFour,
                response.meta.authorization.transfer_account, response.meta.authorization.transfer_bank, 'Futterwave/eGurasa'
            );

            res.json({
                accountName: 'eGurasa FLw',
                accountNumber: response.meta.authorization.transfer_account,
                bankName: response.meta.authorization.transfer_bank,
                amount: response.meta.authorization.transfer_amount,
                id: newOrder.insertId,
                orderId: orderId,
                lastFour: lastFour
            });

            const vendor = await queryVendorById(productsArray[0].vendor_id);
            console.log('vnedorrrrrrrrrrrr', productsArray[0].vendor_id, vendor);
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