import { Request, response, Response } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryAdminCreateStaff, queryAdminStaffExist, queryRemoveStaff, queryStaffs, queryUpdateStaff } from "../../services/admin/staff-queries";
import staffAccountVerificationLinkSender from "../../modules/admin/send-staff-activation-mail";

// hnadler to fetch staff
const getStaffs = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const { pagin, limit } = req.params;
        const staffs = await queryStaffs(vendorId, parseInt(pagin), parseInt(limit));

        res.json(staffs);
    } catch (err) {
        console.error('an error occured in get staffs', err);
        res.status(500).json({ message: err });
    };
};


// function handler to create new staff
const createStaff = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const { firstName, lastName, email, password } = req.body;

        console.log(firstName, lastName, email, password, 'staff create data');
        if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'Incomplete data sent to server for processing.' });

        const staffExits = await queryAdminStaffExist(email, vendorId);

        if (staffExits) return res.status(401).json({ messag: 'user staff with email already exist in this organisation' });

        const created = await queryAdminCreateStaff(vendorId, firstName, lastName, email, password);

        if (!created) throw 'Something went wrong creating staff';
        res.json({ message: 'Staff created successfully.' });
        const response = await staffAccountVerificationLinkSender(vendorId, email);
        console.log(response);
    } catch (err) {
        console.error('an error occured creating new staff', err);
        res.status(500).json({ message: err });
    };
};


// function handler to edit stafff 
const editStaff = async (req: Request, res: Response) => {
    try {
        // @ts-ignore 
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const staffId: number = parseInt(req.params.staffId);
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'Incomplete data sent to server for processing.' });

        const staffExits = await queryAdminStaffExist(email, vendorId);

        if (staffExits) {
            if (staffExits.id !== staffId) return res.status(401).json({ message: 'A staff with this email already exits' });
        };

        const updated = await queryUpdateStaff(firstName, lastName, email, password, staffId, vendorId);

        if (!updated) throw 'Something went wrong updating staff';

        res.json({ message: 'staff updated successsfully' });
    } catch (err) {
        console.error('an error occured editing  staff', err);
        res.status(500).json({ message: err });
    };
};


// function to remove staff
const removeStaff = async (req: Request, res: Response) => {
    try {
        // @ts-ignore 
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const staffId: number = parseInt(req.params.staffId);
        const removed = await queryRemoveStaff(staffId, vendorId);

        if (!removed) throw 'Something went wrong removing staff';

        res.json({ message: 'staff removed successsfully' });
    } catch (err) {
        console.error('an error occured removing  staff', err);
        res.status(500).json({ message: err });
    };
};


// route to resend staff account activation email
const reSendStaffActivationEmail = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const staffEmail: string = req.params.staffEmail;
        const resent = staffAccountVerificationLinkSender(vendorId, staffEmail);

        if (!resent) throw 'An error occured resending email, reload page';
        res.json({message: 'Emai successfully sent.'});
    } catch (err) {
        console.error('an error in resending staff activation email', err);
        res.status(500).json({ message: err });
    };
};


export {
    getStaffs,
    createStaff,
    editStaff,
    removeStaff,
    reSendStaffActivationEmail,
}