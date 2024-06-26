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
exports.removeDOrder = exports.getDOrders = exports.createDOrder = void 0;
const order_queries_1 = require("../../services/users/order-queries");
// handler for defined ordr creation
const createDOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // @ts-ignore
    const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
    const { gurasa, suya, name } = req.body;
    const date = new Date();
    try {
        const result = yield (0, order_queries_1.saveDOrder)(gurasa, suya, name, userId, date);
        if (result === true)
            return res.json({ message: 'defined order created successfully' });
        throw 'error';
    }
    catch (_b) {
        res.status(500).json({ message: 'Something went wrong' });
    }
    ;
});
exports.createDOrder = createDOrder;
// handler to handle getting defined orders
const getDOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    // @ts-ignore
    const userId = (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.id;
    try {
        const count = parseInt(req.params.count);
        const limit = parseInt(req.params.limit);
        const result = yield (0, order_queries_1.retrieveDOrder)(count, limit, userId);
        console.log(result, 'in getDordersss');
        return res.json({ data: result });
    }
    catch (err) {
        console.error;
        res.status(500).json({ message: 'Something went wrong' });
    }
    ;
});
exports.getDOrders = getDOrders;
// function to handle deleting of defined order
const removeDOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        // @ts-ignore
        const userId = (_d = req.session.user) === null || _d === void 0 ? void 0 : _d.id;
        const id = parseInt(req.params.id);
        const response = yield (0, order_queries_1.deleteDOrder)(id, userId);
        if (response === true)
            return res.json({ message: `defined order with id ${id} deleted succesfully` });
    }
    catch (err) {
        console.error;
        res.status(500).json({ message: 'unable to delete defined order something went wrong' });
    }
});
exports.removeDOrder = removeDOrder;
//# sourceMappingURL=defined-orders.js.map