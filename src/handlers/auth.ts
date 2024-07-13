import { Request, Response } from 'express';
import { checkUserExist, createNewUser } from '../services/users/users-queries';
import { CustomSessionData } from './../types/session-types';
import { queryStaff } from '../services/staffs/auth-queries';
import { queryAdmin } from '../services/admin/auth-query';


// function to handle user login
const logInHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const response = await checkUserExist(email);

        console.log('response .......', response)
        if (response && response.password === password) {
            // @ts-ignore
            (req.session as CustomSessionData).user = {
                email: email,
                type: 'normal',
                id: response.id
            }
            return res.status(200).json({ message: 'logged in succesfully' });
        };
        res.status(404).json({ message: 'user with cridentials not found' });
    } catch (err) {
        console.error('error in login api', err);
        res.status(500).json({ message: err });
    };
};


// function to handle log in
const handleStaffLogin = async (req: Request, res: Response) => {
    try {
        const { email, password, vendorId } = req.body;

        const staff = await queryStaff(email, vendorId);

        console.log('staffff', staff);
        if (staff && staff.password === password) {
            (req.session as CustomSessionData).user = {
                email: email,
                type: 'staff',
                id: staff.id,
                vendorId: staff.vendor_id,
            };
            return res.status(200).json({ message: 'logged in succesfully' });
        };
        res.status(404).json({ message: 'user with cridentials not found' });
    } catch (err) {
        console.error('error occurde in staff login', err);
        res.status(500).json({ message: err });
    };
};


// funciton  to handle admin login
const handleAdminLogin = async (req: Request, res: Response) => {
    try {
        const { email, password, vendorId } = req.body;
        const admin = await queryAdmin(email, vendorId);

        console.log('staffff', admin);
        if (admin && admin.password === password) {
            (req.session as CustomSessionData).user = {
                email: email,
                type: 'admin',
                id: admin.id,
                vendorId: admin.vendor_id,
            };
            return res.status(200).json({ message: 'logged in succesfully' });
        };
        res.status(404).json({ message: 'user with cridentials not found' });
    } catch (err) {
        console.error('error occurde in admin login', err);
        res.status(500).json({ message: err });
    };
};


// function to handle creating of new accont 
const createAccountHandler = async (req: Request, res: Response) => {
    const { firstName, lastName, email, phoneNumber, password, gender } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password || !gender) return res.status(401).json({ message: 'incomplete data sent to server for processing' });

    try {
        const response = await checkUserExist(email);

        if (response) {
            return res.status(409).json({ message: 'user exist' });
        };

        const created = await createNewUser(firstName, lastName, email, phoneNumber, password, gender);

        if (created.affectedRows === 1) {
            // @ts-ignore
            (req.session as CustomSessionData).user = {
                email: email,
                type: 'normal',
                id: created.insertId
            };
            return res.json({ message: 'account created successfully' });
        };

        throw 'unable to create new user';
    } catch (err) {
        console.error('error in sign up api');
        res.status(500).json({ message: 'An error occured trying to create acount' });
    };
};

export {
    logInHandler,
    createAccountHandler,
    handleStaffLogin,
    handleAdminLogin,
};
