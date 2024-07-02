"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueryUpdateNoteToViewedById = exports.userQueryUpdateNoteToViewed = exports.queryUserNotifications = exports.queryUserCountUnViewedNoti = exports.addNewNotification = void 0;
const connectdb_1 = __importDefault(require("../../modules/connectdb"));
// query to add new notificaion
const addNewNotification = (userId, title, message, type, viewed, url) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO notifications (user_id, title, message, type, viewed, url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connectdb_1.default.query(query, [userId, title, message, type, viewed, url, date], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.addNewNotification = addNewNotification;
// 
const queryUserCountUnViewedNoti = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM notifications WHERE user_id = ? AND viewed = false';
        connectdb_1.default.query(query, [userId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result[0]['COUNT(*)']);
        });
    });
};
exports.queryUserCountUnViewedNoti = queryUserCountUnViewedNoti;
// funcion to query usr notificaions and order it by data in latest to oldest
const queryUserNotifications = (userId, limit, pagin) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
        connectdb_1.default.query(query, [userId, limit, pagin], (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};
exports.queryUserNotifications = queryUserNotifications;
// query to set all unviewed notification to viewd
const userQueryUpdateNoteToViewed = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE notifications SET viewed = true WHERE user_id = ? AND viewed = false ';
        connectdb_1.default.query(query, [userId], (err, result) => {
            if (err)
                return reject(err);
            resolve(true);
        });
    });
};
exports.userQueryUpdateNoteToViewed = userQueryUpdateNoteToViewed;
// query to set all unviewed notification to viewd
const userQueryUpdateNoteToViewedById = (userId, id) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE notifications SET viewed = true WHERE user_id = ? AND viewed = false AND id = ?';
        connectdb_1.default.query(query, [userId, id], (err, result) => {
            if (err)
                return reject(err);
            resolve(true);
        });
    });
};
exports.userQueryUpdateNoteToViewedById = userQueryUpdateNoteToViewedById;
//# sourceMappingURL=notifications-queries.js.map