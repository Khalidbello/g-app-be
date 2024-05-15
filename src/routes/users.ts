import { Router, Request, Response, NextFunction } from 'express';
import { getVAccDetails, createVAcc } from './../handlers/virtual-account';
import { CustomSessionData } from './../types/session-types';
import { createDOrder, getDOrders, removeDOrder } from './../handlers/defined-orders';
import { initiateNewOrder, getOrderById, getOrders } from './../handlers/orders';


const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    if (
        (req.session as CustomSessionData).user?.email && (
            (req.session as CustomSessionData).user?.type === 'normal' ||
            (req.session as CustomSessionData).user?.type === 'admin' ||
            (req.session as CustomSessionData).user?.type === 'super'
        )) {
        next()
    } else {
        res.status(403).json({ message: 'you do not have permission to view this document' });
    };
});




//==================================================================================================
// route related to virtual account

// route to return user virtual account details
router.get('/v-account-details', (req: Request, res: Response) => getVAccDetails(req, res));

// route for creating vietual  account
router.post('/create-v-acc', (req: Request, res: Response) => createVAcc(req, res));



//==========================================================================================================
// route related to defined orders

// route for creating vietual  account
router.post('/create-d-order', (req: Request, res: Response) => createDOrder(req, res));

router.delete('/delete-d-order/:id', (req: Request, res: Response) => removeDOrder(req, res));

// rote to get defined orders
router.get('/defined-orders/:count/:limit', (req: Request, res: Response) => getDOrders(req, res));



//=========================================================================================================
// route related to orders

router.post('/create-order', (req: Request, res: Response) => initiateNewOrder(req, res));

router.get('/get-order-by-id/:id', (req: Request, res: Response) => getOrderById(req, res));

router.get('/orders/:count/:limit', (req: Request, res: Response) => getOrders(req, res));


export default router