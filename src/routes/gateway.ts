import { Router, Request, Response, NextFunction } from 'express';
import { generateOneTimeAcc, webhookHandler } from '../handlers/gateway';

const router = Router();
//====================================================================================
// one tiem account router
router.post('/transfer-account', (req: Request, res: Response) => generateOneTimeAcc(req, res));

router.post('/webhook', (req: Request, res: Response) => webhookHandler(req, res));


export default router;