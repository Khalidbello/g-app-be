import { addNewProduct, deleteProduct, editProduct, getProducts, updateProductImage } from "../handlers/admin/products";
import { createStaff, editStaff, getStaffs, removeStaff } from "../handlers/admin/staffs";
import { getVendorinfo, updateVendorInfo, uploadVendorDp } from "../handlers/admin/vendor-info";
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


// vendor relateed routes
router.get('/vendor-info', (req: Request, res: Response) => getVendorinfo(req, res));

router.post('/vendor-info', (req: Request, res: Response) => updateVendorInfo(req, res));

router.post('/vendor-dp', (req: Request, res: Response) => uploadVendorDp(req, res));


// prodcut related routes
router.get('/products/:pagin/:limit', (req: Request, res: Response) => getProducts(req, res));

router.post('/add-product', (req: Request, res: Response) => addNewProduct(req, res));

router.post('/edit-product/:productId', (req: Request, res: Response) => editProduct(req, res));

router.delete('/delete-product/:productId', (req: Request, res: Response) => deleteProduct(req, res));

router.post('/edit-product-image/:productId', (req: Request, res: Response) => updateProductImage(req, res));


// staff related routes
router.get('/staffs/:pagin/:limit', (req: Request, res: Response) => getStaffs(req, res));

router.post('/add-staff', (req: Request, res: Response) => createStaff(req, res)); 

router.post('/edit-staff/:staffId', (req: Request, res: Response) => editStaff(req, res));

router.delete('/remove-staff/:staffId', (req: Request, res: Response) => removeStaff(req, res));


router.get('/vendor-settings-count', (req: Request, res: Response) => () => { });
router.get('/vendor-settings-count', (req: Request, res: Response) => () => { });


export default router