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
exports.webhookHandler = exports.generateOneTimeAcc = void 0;
const profile_queries_1 = require("../services/users/profile-queries");
const generate_random_string_1 = __importDefault(require("../modules/generate-random-string"));
const order_queries_1 = require("../services/users/order-queries");
const order_queries_2_1 = require("../services/users/order-queries-2");
const notifications_queries_1 = require("../services/users/notifications-queries");
const Flutterwave = require('flutterwave-node-v3');
const fs = require('fs');
const generateOneTimeAcc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // @ts-ignore
        const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        const { gurasaNum, suyaNum } = req.params;
        const data = fs.readFileSync('prices.json', 'utf8'); // Read file synchronously
        const priceData = JSON.parse(data); // Parse JSON string
        const price = parseInt(gurasaNum) * priceData.gurasa + parseInt(suyaNum) * priceData.suya;
        console.error('amunt.......', price);
        const userInfo = yield (0, profile_queries_1.queryUserProfile)(userId);
        // @ts-ignoreF
        const orderId = (0, generate_random_string_1.default)(15, false);
        const details = {
            tx_ref: (0, generate_random_string_1.default)(10, false),
            amount: price,
            email: userInfo.email,
            fullname: userInfo.first_name + ' ' + userInfo.last_name,
            currency: 'NGN',
            meta: {
                gurasaNum,
                suyaNum,
                userId: userInfo.id,
                orderId: orderId
            },
        };
        const flw = new Flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SCRT_KEY);
        const response = yield flw.Charge.bank_transfer(details);
        console.log('accoint detauls :', response);
        const date = new Date();
        console.error('one time account response', response);
        if (response.status === 'success') {
            const newOrder = yield (0, order_queries_1.addNewOrder)(userId, 'placed', parseFloat(gurasaNum), parseInt(suyaNum), price, date, orderId, response.meta.authorization.transfer_account, response.meta.authorization.transfer_bank, 'Futterwave/eGurasa');
            res.json({
                accountName: 'eGurasa FLw',
                accountNumber: response.meta.authorization.transfer_account,
                bankName: response.meta.authorization.transfer_bank,
                amount: response.meta.authorization.transfer_amount,
                id: newOrder.insertId,
                orderId: orderId,
            });
            // add new ordr notification
            return (0, notifications_queries_1.addNewNotification)(userId, 'New Order Placed', `Your order for ${gurasaNum} gurasa and ${suyaNum} suya has been placed successfully.`, 'info', false, `/order?order_id=${orderId}&id=${newOrder.insertId}`);
        }
        ;
        throw 'error in creating virtual acount';
    }
    catch (err) {
        console.log('error in generate one time account number', err);
        res.status(500).json({ message: err });
    }
});
exports.generateOneTimeAcc = generateOneTimeAcc;
// function to responsd ti webhok event
const webhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('am in webhook.......................');
        const signature = req.headers['verif-hash'];
        let payload;
        let meta;
        if (signature != process.env.FLW_H) {
            // This request isn't from Flutterwave; discard
            console.log('webhook rejectd not from a trusted source');
            return res.status(401).end();
        }
        ;
        payload = req.body;
        console.error('webhook payload', payload);
        if (payload.status !== "successful")
            return console.log('payment failed..... in webhook handler.......');
        const id = payload.id;
        const reference = Number(payload.txRef);
        const amount = Number(payload.amount);
        // reverify payment
        const flw = new Flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SCRT_KEY);
        const response = yield flw.Transaction.verify({ id: id });
        console.error('transaction details', response);
        if (response.status !== 'success')
            return console.log('error occured while confirming tansacion');
        if (response.data.status !== "successful")
            return console.log("transaction not successfully carried out: in wallet top up");
        meta = response.data.meta;
        // query to update order status
        (0, order_queries_2_1.updateOrderPaid)(parseInt(meta.userId), meta.orderId);
    }
    catch (err) {
        console.log('error in webhook', err);
    }
    ;
});
exports.webhookHandler = webhookHandler;
//# sourceMappingURL=gateway.js.map