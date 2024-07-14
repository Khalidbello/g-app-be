import { addNewProduct } from "../handlers/admin/products";
import { getVendorDp, getVendorinfo, updateVendorInfo, uploadVendorDp } from "../handlers/admin/vendor-info";
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

router.post('/vendor-info', (req: Request, res: Response) => updateVendorInfo(req, res));

router.post('/vendor-dp', (req: Request, res: Response) => uploadVendorDp(req, res));

router.get('/vendor-settings-count', (req: Request, res: Response) => () => { });

router.get('/add-product', (req: Request, res: Response) => addNewProduct(req, res));

router.get('/edit-product-image', (req: Request, res: Response) => () => { });

export default router