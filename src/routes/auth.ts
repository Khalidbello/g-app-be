import { Router, Request, Response } from 'express';
import { logInHandler, createAccountHandler, handleStaffLogin, handleAdminLogin, passwordRecoveryCheckUser, passwordRecoveryConfirmOtp, passwordRecoveryCheckStaff, passwordRecoveryConfirmOtpStaff, passwordRecoveryCheckAdmin, passwordRecoveryConfirmOtpAdmin } from './../handlers/auth';
import pool from '../modules/connectdb';

const router = Router();

router.post('/login', (req: Request, res: Response) => logInHandler(req, res));

router.post('/create-acount', (req: Request, res: Response) => createAccountHandler(req, res));

router.post('/staff-login', (req: Request, res: Response) => handleStaffLogin(req, res));

router.post('/admin-login', (req: Request, res: Response) => handleAdminLogin(req, res));

router.post('/password-recovery-email', (req: Request, res: Response) => passwordRecoveryCheckUser(req, res));

router.post('/password-recovery-otp', (req: Request, res: Response) => passwordRecoveryConfirmOtp(req, res));


router.post('/staff-password-recovery-email', (req: Request, res: Response) => passwordRecoveryCheckStaff(req, res));

router.post('/staff-password-recovery-otp', (req: Request, res: Response) => passwordRecoveryConfirmOtpStaff(req, res));


router.post('/admin-password-recovery-email', (req: Request, res: Response) => passwordRecoveryCheckAdmin(req, res));

router.post('/admin-password-recovery-otp', (req: Request, res: Response) => passwordRecoveryConfirmOtpAdmin(req, res));


router.post('/logout', (req: Request, res: Response) => {
    try {
        req.session.destroy(() => {
            res.json({ message: 'Logged out' });
        });
    } catch (err) {
        console.log('erorr loging out');
        res.status(500).json({ message: 'Failed to logout' });
    }
});


export default router;