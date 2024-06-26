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
exports.createAccountHandler = exports.logInHandler = void 0;
const users_queries_1 = require("../services/users/users-queries");
// function to handle user login
const logInHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const response = yield (0, users_queries_1.checkUserExist)(email);
        console.log('response .......', response);
        if (response && response.password === password) {
            req.session.user = {
                email: email,
                type: 'normal',
                id: response.id
            };
            return res.status(200).json({ message: 'logged in succesfully' });
        }
        ;
        res.status(404).json({ message: 'user with cridentials not found' });
    }
    catch (err) {
        console.error('error in login api', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.logInHandler = logInHandler;
// function to handle creating of new accont 
const createAccountHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, phoneNumber, password, gender } = req.body;
    if (!firstName || !lastName || !email || !phoneNumber || !password || !gender)
        return res.status(401).json({ message: 'incomplete data sent to server for processing' });
    try {
        const response = yield (0, users_queries_1.checkUserExist)(email);
        if (response) {
            return res.status(409).json({ message: 'user exist' });
        }
        ;
        const created = yield (0, users_queries_1.createNewUser)(firstName, lastName, email, phoneNumber, password, gender);
        if (created.affectedRows === 1) {
            req.session.user = {
                email: email,
                type: 'normal',
                id: created.insertId
            };
            return res.json({ message: 'account created successfully' });
        }
        ;
        throw 'unable to create new user';
    }
    catch (err) {
        console.error('error in sign up api');
        res.status(500).json({ message: 'An error occured trying to create acount' });
    }
    ;
});
exports.createAccountHandler = createAccountHandler;
//# sourceMappingURL=auth.js.map