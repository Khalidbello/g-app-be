import { Router, Request, Response, NextFunction } from "express";
import { CustomSessionData } from "../types/session-types";
import { getPaidOrders, orderToBagged } from "../handlers/vendor/orders";

const router = Router();


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


router.get('/paid-orders', (req: Request, res: Response) => getPaidOrders(req, res));


// route to change to bagged
router.patch('/update-order-to-bagged/:orderKey', (req: Request, res: Response) => orderToBagged(req, res));

export default router;