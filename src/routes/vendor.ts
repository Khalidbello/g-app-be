import { Router, Request, Response, NextFunction } from "express";
import { CustomSessionData } from "../types/session-types";
import { getBaggedByLastFourAndUserId, getBaggedOrders, getPaidOrders, orderToBagged, orderToDelivered } from "../handlers/vendor/orders";
import { activateAccount, checkVerificationCode } from "../handlers/vendor/account-activation";
import { changePassword } from "../handlers/vendor/settings";

const router = Router();


//======================================================================================================================================================
// routes related to staff account activation
router.get('/check-vc/:vc', (req: Request, res: Response) => checkVerificationCode(req, res));

router.post('/activate-account', (req: Request, res: Response) => activateAccount(req, res))

//==============================================================================================================================================
// permission checker
router.use((req: Request, res: Response, next: NextFunction) => {
    if (
        (req.session as CustomSessionData).user?.email && (
            (req.session as CustomSessionData).user?.type === 'staff' ||
            (req.session as CustomSessionData).user?.type === 'admin'
        )) {
        next()
    } else {
        res.status(403).json({ message: 'you do not have permission to view this document' });
    };
});


//================================================================================================================================================================
// routes related to orders

router.get('/paid-orders', (req: Request, res: Response) => getPaidOrders(req, res));

router.patch('/update-order-to-bagged/:orderKey', (req: Request, res: Response) => orderToBagged(req, res));

router.get('/bagged-orders', (req: Request, res: Response) => getBaggedOrders(req, res));

router.get('/search/:lastFour/:userId', (req: Request, res: Response) => getBaggedByLastFourAndUserId(req, res));

router.patch('/update-order-to-delivered/:orderKey', (req: Request, res: Response) => orderToDelivered(req, res));


//================================================================================================================================================================
// routes related to settings

router.post('/change-password', (req: Request, res: Response) => changePassword(req, res));


export default router;