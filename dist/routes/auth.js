"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./../handlers/auth");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => {
    try {
        (0, auth_1.logInHandler)(req, res);
    }
    catch (err) {
        console.log('an error occured in login');
        res.status(500).json({ message: err });
    }
    ;
});
router.post('/create-acount', (req, res) => {
    try {
        console.log('in create account..........');
        (0, auth_1.createAccountHandler)(req, res);
    }
    catch (err) {
        console.log('error in create account', err);
        res.status(500).json({ message: err });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map