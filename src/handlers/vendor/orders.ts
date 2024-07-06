import { Request, Response } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryStaffData } from "../../services/vendors/staff-queries";
import { queryPaidOrders } from "../../services/vendors/order-queries";

const getPaidOrders = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const staffId: number = (req.session as CustomSessionData).user?.id;
        const staffData = await queryStaffData(staffId);

        console.log('staff data', staffData);
        
        if (!staffData) return res.status(400).json({ message: 'this staff is not indentified please contact support' });

        const paidOrders = await queryPaidOrders(staffData.vendor_id, 0, 10);
        res.json(paidOrders);
    } catch (err) {
        console.error('error in create defined order', err);
        res.status(500).json({ message: 'Something went wrong' });
    };
};


export {
    getPaidOrders,
};