import { Request, Response } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryAdminCreateUser, queryAdminStaffExist } from "../../services/admin/staff-queries";

// function handler to create new staff
const createStaff = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'Incomplete data sent to server for processing.' });

        const staffExits = await queryAdminStaffExist(email, vendorId);

        if (staffExits) return res.status(401).json({ messag: 'user staff with email already exist in this organisation' });

        const created = await queryAdminCreateUser(vendorId, firstName, lastName, email, password);

        if (!created) throw 'Something went wrong creating staff';
        res.json({ message: 'Staff created successfully.' });
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
        const staffId:number = parseInt(req.params.staffId);
        
    } catch (err) {
        console.error('an error occured editing  staff', err);
        res.status(500).json({ message: err });
    };
};


export {
    createStaff,
}