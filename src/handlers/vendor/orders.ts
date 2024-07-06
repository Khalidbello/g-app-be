import { Request, Response } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryStaffData } from "../../services/vendors/staff-queries";
import { queryOrderByKey, queryPaidOrders, queryVendorOrderToBagged } from "../../services/vendors/order-queries";
import { addNewNotification } from "../../services/users/notifications-queries";

const getPaidOrders = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const staffId: number = (req.session as CustomSessionData).user?.id;
        const staffData = await queryStaffData(staffId);

        if (!staffData) return res.status(400).json({ message: 'this staff is not indentified please contact support' });

        const paidOrders = await queryPaidOrders(staffData.vendor_id, 0, 10);
        res.json(paidOrders);
    } catch (err) {
        console.error('error in create defined order', err);
        res.status(500).json({ message: 'Something went wrong' });
    };
};


// function to change order status to baged
const orderToBagged = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const staffId: number = (req.session as CustomSessionData).user?.id;
        const orderKey = parseInt(req.params.orderKey);

        if (!orderKey) return res.status(401).json({ message: 'incomplete data sent to server for processing' });

        const staffData = await queryStaffData(staffId);

        if (!staffData) return res.status(400).json({ message: 'this staff is not indentified please contact support' });

        const updated = await queryVendorOrderToBagged(staffId, staffData.vendor_id, orderKey);

        if (!updated) return res.status(404).json({ message: 'order not found' });

        // send notification to user
        const orderData = await queryOrderByKey(orderKey);
        const message = `Your order with orderID: ${orderData.order_id} has been successfully bagged, if 
            \n if order was self pick up kindly go vendors stores to pick up order. \n if order is point delivery kindly staff close to your phone our 
            delivery service would contact you any moment from now`;

        // @ts-expect-error
        addNewNotification(orderData.user_id, 'Order succesfully bagged', message, 'info', false, `/order?order_id=${orderData.order_id}&id=${orderData.id}`)
        res.json({ message: 'ordr bagged successfully' });
    } catch (err) {
        console.error('error in change order to bagged', err);
        res.status(500).json({ message: 'Something went wrong' });
    };
};


export {
    getPaidOrders,
    orderToBagged,
};