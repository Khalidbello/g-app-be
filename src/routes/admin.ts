import { getVendorDp, getVendorinfo, uploadVendorDp } from "../handlers/admin/vendor-info";
import { CustomSessionData } from "../types/session-types";
import { Router, Request, Response, NextFunction } from "express";

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


router.get('/vendor-info', (req: Request, res: Response) => getVendorinfo(req, res));


router.get('/vendor-dp', (req: Request, res: Response) => getVendorDp(req, res));


router.get('/vendor-info', (req: Request, res: Response) => () => { });


router.post('/vendor-dp', (req: Request, res: Response) => uploadVendorDp(req, res));


router.get('/vendor-info', (req: Request, res: Response) => () => { });


export default router