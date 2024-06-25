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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBalance = exports.saveVAcc = exports.getAcc = void 0;
const connectdb_1 = __importDefault(require("../modules/connectdb"));
const getAcc = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const query = 'SELECT account_number, account_name, bank_name, balance FROM virtual_account WHERE email = ?';
        connectdb_1.default.query(query, [email], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                console.log(results);
                resolve(results[0]);
            }
        });
    });
});
exports.getAcc = getAcc;
const saveVAcc = (account_name, account_number, bank_name, email, tx_ref, balance = 0) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO virtual_account (account_name, account_number, bank_name, email, tx_ref, balance) VALUES (?, ?, ?, ?, ?, ?)';
        connectdb_1.default.query(query, [account_name, account_number, bank_name, email, tx_ref, balance], (err, result) => {
            if (err) {
                console.error('An error occurred in creating user:', err);
                reject(err);
            }
            else {
                console.log(result, 'result.........');
                resolve(result.affectedRows > 0);
            }
            ;
        });
    });
});
exports.saveVAcc = saveVAcc;
const updateBalance = (newBalance, email) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE virtual_account SET balance = ? WHERE email = ?';
        connectdb_1.default.query(query, [newBalance.toFixed(2), email], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                console.log(result, 'update balance', result.affectedRows);
                resolve(result.affectedRows > 0);
            }
        });
    });
};
exports.updateBalance = updateBalance;
//# sourceMappingURL=v-acc-queries.js.map