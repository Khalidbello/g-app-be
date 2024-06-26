"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryOrderById = exports.getPlacedOrders = exports.addNewOrder = exports.deleteDOrder = exports.retrieveDOrder = exports.saveDOrder = void 0;
const connectdb_1 = __importDefault(require("../../modules/connectdb"));
// function to save new defined order
const saveDOrder = (gurasa, suya, name, userId, date) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO defined_orders (suya, gurasa, name, created, user_id) VALUES (?, ?, ?, ?, ?)';
        connectdb_1.default.query(query, [suya, gurasa, name, date, userId], (err, result) => {
            if (err) {
                console.log('an error occured trying to create new defined order', err);
                reject(err);
            }
            else {
                console.log(result);
                resolve(result.affectedRows > 0);
            }
            ;
        });
    });
};
exports.saveDOrder = saveDOrder;
// function to retrieve defined order
const retrieveDOrder = (count, limit, userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT suya, gurasa, name, id FROM defined_orders WHERE user_id = ? ORDER BY created DESC LIMIT ? OFFSET ?';
        connectdb_1.default.query(query, [userId, limit, limit * count], (err, result) => {
            if (err) {
                console.log('an error ocured fetching defined order', err);
                reject(err);
            }
            else {
                console.log(result);
                resolve(result);
            }
            ;
        });
    });
};
exports.retrieveDOrder = retrieveDOrder;
// query to delete order
const deleteDOrder = (id, userId) => {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM defined_orders WHERE id = ? AND user_id = ?';
        connectdb_1.default.query(query, [id, userId], (err, result) => {
            if (err) {
                console.log('an error ocured fetching defined order', err);
                reject(false);
            }
            else {
                console.log(result);
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.deleteDOrder = deleteDOrder;
// query to add a new order to the database
const addNewOrder = (user, status, gurasa, suya, price, created_date, payment_date, order_id) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO orders (user, status, gurasa, suya, price, created_date, payment_date, order_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        connectdb_1.default.query(query, [user, status, gurasa, suya, price, created_date, payment_date, order_id], (err, result) => {
            if (err) {
                console.log('an error ocured fetching defined order', err);
                reject(err);
            }
            else {
                console.log(result);
                resolve(result);
            }
        });
    });
};
exports.addNewOrder = addNewOrder;
// query to fetch user orders 
const getPlacedOrders = (email, limit, count) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT  status, gurasa, suya, price, created_date, order_id, id FROM orders WHERE user = ?  ORDER BY created_date DESC LIMIT ? OFFSET ?';
        connectdb_1.default.query(query, [email, limit, count * limit], (err, result) => {
            if (err) {
                console.log('an error ocured fetching defined order', err);
                reject(err);
            }
            else {
                console.log(result);
                resolve(result);
            }
        });
    });
};
exports.getPlacedOrders = getPlacedOrders;
const queryOrderById = (email, id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT status, order_id, gurasa, suya, price, created_date, id, payment_date, bagged_date, deliver_date FROM orders WHERE user = ? AND id = ?';
        connectdb_1.default.query(query, [email, id], (err, result) => {
            if (err) {
                console.log('an error ocured fetching defined order', err);
                reject(err);
            }
            else {
                console.log(result);
                resolve(result);
            }
        });
    });
};
exports.queryOrderById = queryOrderById;
//# sourceMappingURL=order-queries.js.map