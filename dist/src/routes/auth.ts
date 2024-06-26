import { Router, Request, Response } from 'express';
import { logInHandler, createAccountHandler } from './../handlers/auth';
import pool from '../modules/connectdb';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
    try {
        logInHandler(req, res);
    } catch (err) {
        console.log('an error occured in login');
        res.status(500).json({ message: err });
    };
});


router.post('/create-acount', (req: Request, res: Response) => {
    try {
        console.log('in create account..........');
        createAccountHandler(req, res);
    } catch (err) {
        console.log('error in create account', err);
        res.status(500).json({ message: err });
    }
})
export default router