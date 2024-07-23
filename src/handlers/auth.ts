import { Request, Response } from 'express';
import { checkUserExist, createNewUser } from '../services/users/users-queries';
import { CustomSessionData } from './../types/session-types';
import { queryStaff } from '../services/staffs/auth-queries';
import { queryAdmin } from '../services/admin/auth-query';
import emailOtpSender from '../modules/emailers/email-otp';
import otpGenerator from '../modules/opt-generator';
import { queryDeleteOtp, queryOtp } from '../services/otp-queries';


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

        console.log('admin', admin);
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



//==================================================================================================================================
// password recovery related handlers


// function to checkif user exist for password recovery
const passwordRecoveryCheckUser = async (req: Request, res: Response) => {
    try {
        const email: string = req.body.email;
        const exist = await checkUserExist(email);


        if (!exist) return res.status(404).json({ message: 'user with credentials not found.' });

        // ts-ignore
        const opt: number = await otpGenerator(exist.id);
        // send otp email
        emailOtpSender(email, exist.first_name, opt);

        res.json({ message: 'user exist' });
    } catch (err) {
        console.error('error in passwordRecoveryCheckUser', err);
        res.status(500).json({ message: 'An error occured trying to find account' });
    };
};



// function to confirm otp if valid retrun user password
const passwordRecoveryConfirmOtp = async (req: Request, res: Response) => {
    try {
        const otp = req.body.otp;
        const email = req.body.email;

        if (!email || !otp) return res.status(400).json({ message: 'incomlete data sent to server' });

        const user = await checkUserExist(email);
        const dbOtp = await queryOtp(user.id);
        const equal: boolean = otp === dbOtp?.otp;

        if (!equal) return res.status(401).json({ status: equal });

        await queryDeleteOtp(user.id);

        res.json({ password: user.password });
    } catch (err) {
        console.error('error in passwordRecoveryCheckUser', err);
        res.status(500).json({ message: 'An error occured tryng get user password' });
    };
};


// password recovery for staaffs

// function to checkif user exist for password recovery
const passwordRecoveryCheckStaff = async (req: Request, res: Response) => {
    try {
        const { email, vendorId } = req.body;
        const staff = await queryStaff(email, vendorId);

        if (!staff) return res.status(404).json({ message: 'user with credentials not found.' });

        const opt: number = await otpGenerator(staff.id);
        // send otp email
        emailOtpSender(email, staff.first_name, opt);

        res.json({ message: 'staff exist' });
    } catch (err) {
        console.error('error in passwordRecoveryCheckStaff', err);
        res.status(500).json({ message: 'An error occured trying to find account' });
    };
};



// function to confirm otp if valid return staff password
const passwordRecoveryConfirmOtpStaff = async (req: Request, res: Response) => {
    try {
        const { email, vendorId, otp } = req.body;

        if (!email || !vendorId || !otp) return res.status(400).json({ message: 'incomlete data sent to server' });

        const staff = await queryStaff(email, vendorId);
        const dbOtp = await queryOtp(staff.id);
        const equal: boolean = otp === dbOtp?.otp;

        if (!equal) return res.status(401).json({ status: equal });

        await queryDeleteOtp(staff.id);

        res.json({ password: staff.password });
    } catch (err) {
        console.error('error in passwordRecoveryCheckUser', err);
        res.status(500).json({ message: 'An error occured tryng get user password' });
    };
};


// for admin password recovery 

// function to checkif user exist for password recovery
const passwordRecoveryCheckAdmin = async (req: Request, res: Response) => {
    try {
        const { email, vendorId } = req.body;
        const admin = await queryAdmin(email, vendorId);

        if (!admin) return res.status(404).json({ message: 'admin with credentials not found.' });

        const opt: number = await otpGenerator(admin.id);
        // send otp email
        emailOtpSender(email, admin.first_name, opt);

        res.json({ message: 'admin exist' });
    } catch (err) {
        console.error('error in passwordRecoveryCheckAdmin', err);
        res.status(500).json({ message: 'An error occured trying to find account' });
    };
};



// function to confirm otp if valid return staff password
const passwordRecoveryConfirmOtpAdmin = async (req: Request, res: Response) => {
    try {
        const { email, vendorId, otp } = req.body;

        if (!email || !vendorId || !otp) return res.status(400).json({ message: 'incomlete data sent to server' });

        const admin = await queryAdmin(email, vendorId);
        const dbOtp = await queryOtp(admin.id);
        const equal: boolean = otp === dbOtp?.otp;

        if (!equal) return res.status(401).json({ status: equal });

        await queryDeleteOtp(admin.id);

        res.json({ password: admin.password });
    } catch (err) {
        console.error('error in passwordRecoveryCheckUser', err);
        res.status(500).json({ message: 'An error occured tryng get user password' });
    };
};


export {
    logInHandler,
    createAccountHandler,
    handleStaffLogin,
    handleAdminLogin,
    passwordRecoveryCheckUser,
    passwordRecoveryConfirmOtp,
    passwordRecoveryCheckStaff,
    passwordRecoveryConfirmOtpStaff,
    passwordRecoveryCheckAdmin,
    passwordRecoveryConfirmOtpAdmin,
};
