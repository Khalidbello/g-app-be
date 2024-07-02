import { Router, Request, Response } from 'express';
import { logInHandler, createAccountHandler, handleStaffLogin } from './../handlers/auth';
import pool from '../modules/connectdb';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
    try {
        logInHandler(req, res);
    } catch (err) {
        console.error('an error occured in login');
        res.status(500).json({ message: err });
    };
});


router.post('/create-acount', (req: Request, res: Response) => {
    try {
        createAccountHandler(req, res);
    } catch (err) {
        console.error('error in create account', err);
        res.status(500).json({ message: err });
    };
});


router.post('/staff-login', (req: Request, res: Response) => {
    try {
        handleStaffLogin(req, res);
    } catch (err) {
        console.error('an error occured in login');
        res.status(500).json({ message: err });
    };
});
export default router