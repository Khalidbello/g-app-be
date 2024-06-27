import { Router, Request, Response, NextFunction } from 'express';
import { generateOneTimeAcc, webhookHandler } from '../handlers/gateway';

const router = Router();
//====================================================================================
// one tiem account router
router.get('/transfer-account/:gurasaNum/:suyaNum', (req: Request, res: Response) => generateOneTimeAcc(req, res));

router.post('/webhook', (req: Request, res: Response) => webhookHandler(req, res)); 


export default router;