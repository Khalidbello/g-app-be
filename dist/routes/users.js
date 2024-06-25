"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const virtual_account_1 = require("./../handlers/virtual-account");
const defined_orders_1 = require("./../handlers/defined-orders");
const orders_1 = require("./../handlers/orders");
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
exports.default = router;
//# sourceMappingURL=users.js.map