import { query, Request, Response } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryStaffData } from "../../services/staffs/staff-queries";
import { queryChangeStaffPassword, queryUpdateProductAvailability } from "../../services/staffs/staff-setings-queries";


// handler to change available status
const changeProductAvailability = async (req: Request, res: Response) => {

    try {
        // @ts-ignore
        const updaterId: number = (req.session as CustomSessionData).user?.id;
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const { productAvailablity, productId } = req.body;
        const updated = await queryUpdateProductAvailability(vendorId, productAvailablity, productId, updaterId);

        if (!updated) throw 'Something went wrong updating product availablity';
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error('An error occured changing product availability', err);
        res.status(500).json({ message: err });
    };
};


// handler for change password fucntionality
const changePassword = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const staffId: number = (req.session as CustomSessionData).user?.id;
        const { password, newPassword, confirmNewPassword } = req.body;

        if (!password || !newPassword || !confirmNewPassword) return res.status(400).json({ message: 'Incomplete data sent to server for processing' });

        const staffInfo = await queryStaffData(staffId);

        if (staffInfo.password !== password) return res.status(402).json({ message: 'password does not match' });

        const updated = await queryChangeStaffPassword(staffId, newPassword);

        if (!updated) throw 'Something went wrong changing staff password';
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('An error occured changing staff password', err);
        res.status(500).json({ message: err });
    };
};


export {
    changePassword,
    changeProductAvailability
}