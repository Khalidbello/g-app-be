import { Router, Request, Response, NextFunction } from 'express';
import { getVAccDetails, createVAcc } from './../handlers/virtual-account';
import { CustomSessionData } from './../types/session-types';
import { createDOrder, getDOrders, removeDOrder } from '../handlers/defined-orders';


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


// route to return user virtual account details
router.get('/v-account-details', (req: Request, res: Response) => {
    try {
        getVAccDetails(req, res);
    } catch (err) {
        console.log('error in get v account details..', err);
        res.status(500).json({ messag: err });
    }
});

// route for creating vietual  account
router.post('/create-v-acc', (req: Request, res: Response) => {
    try {
        createVAcc(req, res);
    } catch (err) {
        console.log('error in create-v-acc....', err);
        res.status(500).json({ messag: err })
    };
});


// route for creating vietual  account
router.post('/create-d-order', (req: Request, res: Response) => {
    try {
        createDOrder(req, res);
    } catch (err) {
        console.log('error in create-d-order....', err);
        res.status(500).json({ messag: err })
    };
});



router.delete('/delete-d-order/:id', (req: Request, res: Response) => {
    try {
        removeDOrder(req, res);
    } catch (err) {
        console.log('error in delete d order....', err);
        res.status(500).json({ messag: err })
    };
});

// rote to get defined orders
router.get('/defined-orders/:count/:limit', (req: Request, res: Response) => {
    try {
        getDOrders(req, res);
    } catch (err) {
        console.log('error in defined orders....', err);
        res.status(500).json({ messag: err })
    };
});


export default router