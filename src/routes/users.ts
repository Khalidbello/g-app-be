import { Router, Request, Response, NextFunction } from 'express';
import { getVAccDetails, createVAcc } from './../handlers/virtual-account';
import { CustomSessionData } from './../types/session-types';
import { createDOrder, getDOrders, removeDOrder } from '../handlers/users/defined-orders';
import { initiateNewOrder, getOrderById, getOrders } from '../handlers/users/orders';
import { confirmEmailOtp, generateConfirmEmailOtp, getCheckEmailVerify } from '../handlers/users/email-verification';
import { getUserProfileData, handleChangeNames, handleChangePassword } from '../handlers/users/profile';
import { generateOneTimeAcc } from '../handlers/gateway';
import { checkUnViewedNotiication, getNotifications, setNotToViewed } from '../handlers/users/notification';


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



//========================================================================================================
// route related to user profile

//router.post('/edit-dp', (req: Request, res: Response) => userDpUpload(req, res));
router.get('/profile', (req: Request, res: Response) => getUserProfileData(req, res));

router.get('/check-email-verify', (req: Request, res: Response) => getCheckEmailVerify(req, res));

router.post('/confirm-email-otp', (req: Request, res: Response) => confirmEmailOtp(req, res));

router.post('/send-email-confirm-otp', (req: Request, res: Response) => generateConfirmEmailOtp(req, res));

router.post('/change-password', (req: Request, res: Response) => handleChangePassword(req, res));

router.post('/change-names', (req: Request, res: Response) => handleChangeNames(req, res));


// routes related to notification

router.get('/unviewed-notification', (req: Request, res: Response) => checkUnViewedNotiication(req, res));

router.get('/notifications/:limit/:pagin', (req: Request, res: Response) => getNotifications(req, res));

router.get('/update-notification/:id', (req: Request, res: Response) => setNotToViewed(req, res));

// router.get('/user-dp', (req: Request, res: Response) => getUserDp(req, res));

export default router
