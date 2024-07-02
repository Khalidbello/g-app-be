"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const virtual_account_1 = require("./../handlers/virtual-account");
const defined_orders_1 = require("../handlers/users/defined-orders");
const orders_1 = require("../handlers/users/orders");
const email_verification_1 = require("../handlers/users/email-verification");
const profile_1 = require("../handlers/users/profile");
const notification_1 = require("../handlers/users/notification");
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    var _a, _b, _c, _d;
    if (((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.email) && (((_b = req.session.user) === null || _b === void 0 ? void 0 : _b.type) === 'normal' ||
        ((_c = req.session.user) === null || _c === void 0 ? void 0 : _c.type) === 'admin' ||
        ((_d = req.session.user) === null || _d === void 0 ? void 0 : _d.type) === 'super')) {
        next();
    }
    else {
        res.status(403).json({ message: 'you do not have permission to view this document' });
    }
    ;
});
//==================================================================================================
// route related to virtual account
// route to return user virtual account details
router.get('/v-account-details', (req, res) => (0, virtual_account_1.getVAccDetails)(req, res));
// route for creating vietual  account
router.post('/create-v-acc', (req, res) => (0, virtual_account_1.createVAcc)(req, res));
//==========================================================================================================
// route related to defined orders
// route for creating vietual  account
router.post('/create-d-order', (req, res) => (0, defined_orders_1.createDOrder)(req, res));
router.delete('/delete-d-order/:id', (req, res) => (0, defined_orders_1.removeDOrder)(req, res));
// rote to get defined orders
router.get('/defined-orders/:count/:limit', (req, res) => (0, defined_orders_1.getDOrders)(req, res));
//=========================================================================================================
// route related to orders
router.post('/create-order', (req, res) => (0, orders_1.initiateNewOrder)(req, res));
router.get('/get-order-by-id/:id', (req, res) => (0, orders_1.getOrderById)(req, res));
router.get('/orders/:count/:limit', (req, res) => (0, orders_1.getOrders)(req, res));
//========================================================================================================
// route related to user profile
//router.post('/edit-dp', (req: Request, res: Response) => userDpUpload(req, res));
router.get('/profile', (req, res) => (0, profile_1.getUserProfileData)(req, res));
router.get('/check-email-verify', (req, res) => (0, email_verification_1.getCheckEmailVerify)(req, res));
router.post('/confirm-email-otp', (req, res) => (0, email_verification_1.confirmEmailOtp)(req, res));
router.post('/send-email-confirm-otp', (req, res) => (0, email_verification_1.generateConfirmEmailOtp)(req, res));
router.post('/change-password', (req, res) => (0, profile_1.handleChangePassword)(req, res));
router.post('/change-names', (req, res) => (0, profile_1.handleChangeNames)(req, res));
// routes related to notification
router.get('/unviewed-notification', (req, res) => (0, notification_1.checkUnViewedNotiication)(req, res));
router.get('/notifications/:limit/:pagin', (req, res) => (0, notification_1.getNotifications)(req, res));
router.get('/update-notification/:id', (req, res) => (0, notification_1.setNotToViewed)(req, res));
// router.get('/user-dp', (req: Request, res: Response) => getUserDp(req, res));
exports.default = router;
//# sourceMappingURL=users.js.map