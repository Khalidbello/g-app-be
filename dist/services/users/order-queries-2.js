"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderPaid = void 0;
const connectdb_1 = __importDefault(require("../../modules/connectdb"));
// query to update order status
const updateOrderPaid = (userId, orderId) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const query = 'UPDATE orders SET status = ?, payment_date = ? WHERE user_id = ? AND order_id = ?';
        connectdb_1.default.query(query, ['paid', date, userId, orderId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.updateOrderPaid = updateOrderPaid;
//# sourceMappingURL=order-queries-2.js.map