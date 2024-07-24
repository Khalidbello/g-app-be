import { Router, Request, Response, NextFunction } from "express";
import { CustomSessionData } from "../types/session-types";
import { getBaggedByLastFourAndUserId, getBaggedOrders, getPaidOrders, orderToBagged, orderToDelivered } from "../handlers/staffs/orders";
import { activateAccount, checkVerificationCode } from "../handlers/staffs/account-activation";
import { changePassword, changeProductAvailability } from "../handlers/staffs/settings";
import { getProducts } from "../handlers/admin/products";
import { getVendorinfo } from "../handlers/admin/vendor-info";

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

router.get('/vendor-info', (req: Request, res: Response) => getVendorinfo(req, res));

router.post('/change-password', (req: Request, res: Response) => changePassword(req, res));

router.post('/update-product-availability', (req: Request, res: Response) => changeProductAvailability(req, res));

// route to fethc and set product availability for staff ui

router.get('/products/:pagin/:limit', (req: Request, res: Response) => getProducts(req, res));


export default router;