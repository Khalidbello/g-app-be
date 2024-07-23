import { Router, Request, Response } from 'express';
import { logInHandler, createAccountHandler, handleStaffLogin, handleAdminLogin, passwordRecoveryCheckUser, passwordRecoveryConfirmOtp } from './../handlers/auth';
import pool from '../modules/connectdb';

const router = Router();

router.post('/login', (req: Request, res: Response) => logInHandler(req, res));

router.post('/create-acount', (req: Request, res: Response) => createAccountHandler(req, res));

router.post('/staff-login', (req: Request, res: Response) => handleStaffLogin(req, res));

router.post('/admin-login', (req: Request, res: Response) => handleAdminLogin(req, res));

router.post('/password-recovery-email', (req: Request, res: Response) => passwordRecoveryCheckUser(req, res));

router.post('/password-recovery-otp', (req: Request, res: Response) => passwordRecoveryConfirmOtp(req, res));

export default router