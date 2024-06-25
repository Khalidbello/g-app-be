"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = exports.getOrderById = exports.initiateNewOrder = void 0;
const v_acc_queries_1 = require("./../services/v-acc-queries");
const order_queries_1 = require("./../services/order-queries");
const gurasaP = 200;
const suyaP = 100;
const initiateNewOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.email;
        console.log(req.body, 'iitiate order req body');
        const suya = parseInt(req.body.suya);
        const gurasa = parseInt(req.body.gurasa);
        const price = suya * suyaP + gurasa * gurasaP;
        const created_date = new Date();
        const result = yield (0, v_acc_queries_1.getAcc)(email);
        let payment_date;
        if (!suya && !gurasa)
            return res.status(401).json({ message: 'missig parameters' });
        if (!(result === null || result === void 0 ? void 0 : result.account_number))
            return res.status(403).json({ message: 'order cannot be placed unless a user has a virtual account' });
        if (result.balance < price)
            return res.status(402).json({ message: 'user have to fund account', toFund: price - result.balance });
        const newBalance = result.balance - price;
        // @ts-ignore
        const balanceUpdated = yield (0, v_acc_queries_1.updateBalance)(newBalance, email);
        payment_date = new Date();
        console.log(payment_date, 'paymnt date...........');
        if (balanceUpdated !== true)
            throw 'error updating balance';
        // add order to database
        const order_id = 'NVDSVVNEUN1234N5669'; // call functio to create new ordr id
        // @ts-ignore
        const response = yield (0, order_queries_1.addNewOrder)(email, 'paid', gurasa, suya, price, created_date, payment_date, order_id);
        //@ts-ignore
        if (response.affectedRows > 0)
            return res.json({ id: response.insertId });
        throw 'error creating order please report issue';
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
    ;
});
exports.initiateNewOrder = initiateNewOrder;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const email = (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.email;
        const id = parseInt(req.params.id);
        const order = yield (0, order_queries_1.queryOrderById)(email, id);
        res.json({ data: order });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.getOrderById = getOrderById;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const email = (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.email;
        const limit = parseInt(req.params.limit);
        const count = parseInt(req.params.count);
        const orders = yield (0, order_queries_1.getPlacedOrders)(email, limit, count);
        res.json({ data: orders, message: 'order fetched succesfully' });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.getOrders = getOrders;
//# sourceMappingURL=orders.js.map