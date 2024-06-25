"use strict";
// file to handle all route action related to virtual account
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
exports.createVAcc = exports.getVAccDetails = void 0;
const v_acc_queries_1 = require("./../services/v-acc-queries");
const users_queries_1 = require("../services/users-queries");
const getVAccDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.email;
    try {
        const details = yield (0, v_acc_queries_1.getAcc)(email);
        if (!(details === null || details === void 0 ? void 0 : details.account_name)) {
            return res.status(404).json({ message: 'virtual account not found' });
        }
        else {
            res.status(200).json(details);
        }
        ;
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
});
exports.getVAccDetails = getVAccDetails;
// function to handle creation of virtual account
const createVAcc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const bvn = req.body.bvn;
    const email = (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.email;
    const Flutterwave = require('flutterwave-node-v3');
    let response;
    console.log('in create v accont');
    try {
        // get user first name and last name
        const user = yield (0, users_queries_1.checkUserExist)(email);
        if (user.length < 1)
            return res.status(404).json({ message: 'user details not found' });
        const flw = new Flutterwave(process.env.FLWPTK, process.env.FLWSTK);
        const payload = {
            email: email,
            is_permanent: true,
            bvn: bvn,
            tx_ref: email,
            narration: "virtual account for g-app"
        };
        response = yield flw.VirtualAcct.create(payload);
        console.log(response);
        if (response.status === 'success') {
            // @ts-ignore
            const saved = yield (0, v_acc_queries_1.saveVAcc)('FLW', response.data.account_number, response.data.bank_name, email, email);
            if (saved == true)
                return res.json({ message: 'virtual account created succesfully' });
            throw 'something went wrong';
        }
        ;
        throw 'something went wrong';
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
    ;
});
exports.createVAcc = createVAcc;
//# sourceMappingURL=virtual-account.js.map