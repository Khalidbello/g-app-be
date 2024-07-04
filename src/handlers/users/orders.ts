import { Request, Response } from "express";
import { CustomSessionData } from '../../types/session-types';
import { getAcc, updateBalance } from "../../services/v-acc-queries";
import { addNewOrderForVAcc, getPlacedOrders, queryOrderById } from '../../services/users/order-queries';
import { productsType, queryUserVenorProuctsById, queryVendorById } from "../../services/users/user-vendor-queries";
import calcTotalPrice from "../../modules/calc-order-total-price";
import { addNewNotification } from "../../services/users/notifications-queries";
import generateRandomAlphanumericCode from "../../modules/generate-random-string";


const initiateNewOrder = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const email: string = (req.session as CustomSessionData).user?.email;
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const orders = req.body.orders;

        if (!orders) return res.status(401).json({ message: 'missig parameters' });

        const created_date: Date = new Date();
        const acc = await getAcc(email);
        let payment_date: Date;

        if (!acc?.account_number) return res.status(404).json({ message: 'order cannot be placed unless a user has a virtual account' });

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
        const newBalance = acc.balance - totalPrice;

        if (!newBalance || (newBalance < 1)) return res.json({
            toFund: totalPrice - acc.balance,
            accountName: acc.account_name,
            accountNumber: acc.account_number,
            bankName: acc.account_name
        });

        const balanceUpdated: boolean = await updateBalance(newBalance, email);
        payment_date = new Date(); console.log(payment_date, 'paymnt date...........');

        if (balanceUpdated !== true) throw 'error updating balance';

        // add order to database
        // @ts-ignore
        const orderId: string = generateRandomAlphanumericCode(15, false) // call functio to create new ordr id
        // @ts-ignore
        const addedOrder = await addNewOrderForVAcc(email, 'paid', orders, created_date, payment_date, order_id);

        // add new ordr notification
        const vendor = await queryVendorById(productsArray[0].vendor_id)

        await addNewNotification(
            userId, 'New Order Placed', `Your order from ${vendor.name} has been placed successfully.`, 'info',
            false, `/order?order_id=${orderId}&id=${addedOrder.insertId}`
        );

        //@ts-ignore
        if (addedOrder.affectedRows > 0) return res.json({ id: addedOrder.insertId });

        throw 'error creating order please report issue';
    } catch (error) {
        res.status(500).json({ message: error });
    };
};  // end of initiateNewOrder




const getOrderById = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const id = parseInt(req.params.id);

        const order = await queryOrderById(userId, id);

        res.json({ data: order })
    } catch (error) {
        res.status(500).json({ message: error });
    };
};  // end of getOrderById



const getOrders = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const limit: number = parseInt(req.params.limit);
        const count: number = parseInt(req.params.count);

        const orders = await getPlacedOrders(userId, limit, count);
        res.json({ data: orders, message: 'order fetched succesfully' });
    } catch (error) {
        res.status(500).json({ message: error });
    };
};  // end of getOrders



export {
    initiateNewOrder,
    getOrderById,
    getOrders
}