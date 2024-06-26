"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryUserDp = exports.queryUpdateUserDp = exports.queryUserSaveDp = exports.queryUpdateUserNames = exports.queryUpdatePassword = exports.querySaveEmailVerify = exports.queryUserProfile = void 0;
const connectdb_1 = __importDefault(require("../../modules/connectdb"));
const queryUserProfile = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        connectdb_1.default.query(query, [userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
        });
    });
};
exports.queryUserProfile = queryUserProfile;
// const function to change user email verified to true
const querySaveEmailVerify = (userId, email) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET email_verified = ?, email = ? WHERE id = ?';
        connectdb_1.default.query(query, [true, email, userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.querySaveEmailVerify = querySaveEmailVerify;
// query to update user password
const queryUpdatePassword = (userId, newPassword) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET password = ? WHERE id = ?';
        connectdb_1.default.query(query, [newPassword, userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.queryUpdatePassword = queryUpdatePassword;
// query to handle to change user name
const queryUpdateUserNames = (userId, firstName, lastName) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?';
        connectdb_1.default.query(query, [firstName, lastName, userId], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.queryUpdateUserNames = queryUpdateUserNames;
// query chck if user has dp
const queryUserDp = (userId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM user_dp WHERE id = ? LIMIT 1';
        connectdb_1.default.query(query, [userId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result[0]);
        });
    });
};
exports.queryUserDp = queryUserDp;
// query to upload user image
const queryUserSaveDp = (userId, imageBuffer) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO user_dp (user_id, dp) VALUES (?, ?)';
        connectdb_1.default.query(query, [userId, imageBuffer], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryUserSaveDp = queryUserSaveDp;
// to update user dp
const queryUpdateUserDp = (userId, imageBuffer) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE user_dp SET dp = ? WHERE user_id = ?';
        connectdb_1.default.query(query, [imageBuffer, userId], (err, result) => {
            if (err)
                return reject(err);
            resolve(result.affectedRows > 0);
        });
    });
};
exports.queryUpdateUserDp = queryUpdateUserDp;
//# sourceMappingURL=profile-queries.js.map