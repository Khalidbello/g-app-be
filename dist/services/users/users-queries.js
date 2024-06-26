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
exports.createNewUser = exports.checkUserExist = void 0;
const connectdb_1 = __importDefault(require("../../modules/connectdb"));
// function to check if user exists
const checkUserExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        // Use parameterized query to prevent SQL injection
        const query = 'SELECT id, password, first_name, last_name, gender  FROM users WHERE email = ?';
        connectdb_1.default.query(query, [email], (err, result) => {
            if (err) {
                console.error('An error occurred in checkUserExist:', err);
                reject(err); // Reject the promise with the error
            }
            else {
                resolve(result[0]); // Resolve the promise with the boolean result
            }
        });
    });
});
exports.checkUserExist = checkUserExist;
// function to create new user
const createNewUser = (firstName, lastName, email, phoneNumber, password, gender) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO users (first_name, last_name, email, phone_number, password, gender) VALUES (?, ?, ?, ?, ?, ?)';
        connectdb_1.default.query(query, [firstName, lastName, email, phoneNumber, password, gender], (err, result) => {
            if (err) {
                console.log('an eror occured in create User', err);
                reject(err);
            }
            else {
                console.log(result, 'result.........');
                resolve(result);
            }
        });
    });
});
exports.createNewUser = createNewUser;
//# sourceMappingURL=users-queries.js.map