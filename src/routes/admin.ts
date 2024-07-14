import { addNewProduct, getProducts, updateProductImage } from "../handlers/admin/products";
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

router.get('/products/:pagin/:limit', (req: Request, res: Response) => getProducts(req, res));

router.post('/add-product', (req: Request, res: Response) => addNewProduct(req, res));

router.post('/edit-product-image/:productId', (req: Request, res: Response) => updateProductImage(req, res));

export default router