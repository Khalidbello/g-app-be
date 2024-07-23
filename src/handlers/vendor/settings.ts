import { Request, Response } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryStaffData } from "../../services/staffs/staff-queries";
import { queryChangeStaffPassword } from "../../services/staffs/staff-setings-queries";

// handler for change password fucntionality
const changePassword = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const staffId: number = (req.session as CustomSessionData).user?.vendorId;
        const { password, newPassword, confirmNewPassword } = req.body;

        if (!password || !newPassword || !confirmNewPassword) return res.status(400).json({ message: 'Incomplete data sent to server for processing' });

        const staffInfo = await queryStaffData(staffId);

        if (staffInfo.password !== newPassword) return res.status(402).json({ message: 'password does not match' });

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
}