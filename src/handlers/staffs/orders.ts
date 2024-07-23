import { query, Request, Response } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryStaffData } from "../../services/staffs/staff-queries";
import { queryBaggedOrders, queryOrderByKey, queryOrderByLastFourAndUserId, queryOrderByUserIdExLastFour, queryPaidOrders, queryVendorOrderToBagged, queryVendorOrderToDelivered } from "../../services/staffs/order-queries";
import { addNewNotification } from "../../services/users/notifications-queries";
import { queryVendorData } from "../../services/staffs/vendor-queries";

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

        const vendorData = await queryVendorData(staffData.vendor_id);

        if (!vendorData) return res.status(400).json({ message: 'this vendor is not identified please contact support' });

        const updated = await queryVendorOrderToBagged(staffId, staffData.vendor_id, orderKey);

        if (!updated) return res.status(404).json({ message: 'order not found' });

        // send notification to user
        const orderData = await queryOrderByKey(orderKey);
        const message = `Your order from ${vendorData.name} with orderID: ${orderData.order_id} has been successfully bagged, \n please go to vendor for pick up`;

        // @ts-expect-error
        addNewNotification(orderData.user_id, 'Order succesfully bagged', message, 'info', false, `/order?order_id=${orderData.order_id}&id=${orderData.id}`);
        res.json({ message: 'ordr bagged successfully' });
    } catch (err) {
        console.error('error in change order to bagged', err);
        res.status(500).json({ message: 'Something went wrong' });
    };
};  //  end of orderToBagged


// handler to fetched bagged orders 
const getBaggedOrders = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const staffId: number = (req.session as CustomSessionData).user?.id;
        const staffData = await queryStaffData(staffId);

        if (!staffData) return res.status(400).json({ message: 'this staff is not indentified please contact support' });

        const paidOrders = await queryBaggedOrders(staffData.vendor_id, 0, 10);
        res.json(paidOrders);
    } catch (err) {
        console.error('error in create defined order', err);
        res.status(500).json({ message: 'Something went wrong' });
    };
}; // end of getBaggedOrders


// handler to changed order to delivered
const orderToDelivered = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const staffId: number = (req.session as CustomSessionData).user?.id;
        const orderKey = parseInt(req.params.orderKey);

        if (!orderKey) return res.status(401).json({ message: 'incomplete data sent to server for processing' });

        const staffData = await queryStaffData(staffId);

        if (!staffData) return res.status(400).json({ message: 'this staff is not indentified please contact support' });

        const vendorData = await queryVendorData(staffData.vendor_id);

        if (!vendorData) return res.status(400).json({ message: 'this vendor is not identified please contact support' });

        const updated = await queryVendorOrderToDelivered(staffId, staffData.vendor_id, orderKey);

        if (!updated) return res.status(404).json({ message: 'order not found' });

        // send notification to user
        const orderData = await queryOrderByKey(orderKey);
        const message = `Your order from ${vendorData.name} with orderID: ${orderData.order_id} has been successfully delivered`;

        // @ts-ignore
        addNewNotification(orderData.user_id, 'Order succesfully delivered', message, 'success', false, `/order?order_id=${orderData.order_id}&id=${orderData.id}`);
        res.json({ message: 'order deliverd successfully' });
    } catch (err) {
        console.error('error in change order to bagged', err);
        res.status(500).json({ message: 'Something went wrong' });
    };
};  //  end of orderToBagged


// handler to retunr order
const getBaggedByLastFourAndUserId = async (req: Request, res: Response) => {
    try {
        const lastFour = req.params.lastFour;
        const userId = parseInt(req.params.userId);

        if (!lastFour || !userId) return res.status(401).json({ message: 'Incomplete data sent to server to processing' });

        const order = queryOrderByLastFourAndUserId(lastFour, userId);
        const otherOrders = queryOrderByUserIdExLastFour(userId, lastFour);

        const result = await Promise.all([order, otherOrders]);

        res.json({
            order: result[0],
            others: result[1]
        });
    } catch (err) {
        console.error('error in change order to bagged', err);
        res.status(500).json({ message: 'Something went wrong' });
    };
};


export {
    getPaidOrders,
    orderToBagged,
    orderToDelivered,
    getBaggedOrders,
    getBaggedByLastFourAndUserId,
};
