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
exports.confirmEmailOtp = exports.generateConfirmEmailOtp = exports.getCheckEmailVerify = void 0;
const profile_queries_1 = require("../../services/users/profile-queries");
const opt_generator_1 = __importDefault(require("../../modules/opt-generator"));
const email_otp_1 = __importDefault(require("../../modules/emailers/email-otp"));
const otp_queries_1 = require("../../services/otp-queries");
const getCheckEmailVerify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        // @ts-ignore
        const profieData = yield (0, profile_queries_1.queryUserProfile)(userId);
        if (profieData === null || profieData === void 0 ? void 0 : profieData.email_verified) {
            res.json({ status: true, email: profieData === null || profieData === void 0 ? void 0 : profieData.email });
        }
        else {
            res.json({ status: false, email: profieData.email });
        }
        ;
    }
    catch (err) {
        console.error('error in check if email verified', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.getCheckEmailVerify = getCheckEmailVerify;
const generateConfirmEmailOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // @ts-ignore
        const userId = (_b = req.session.user) === null || _b === void 0 ? void 0 : _b.id;
        const { email } = req.body;
        const profileData = yield (0, profile_queries_1.queryUserProfile)(userId);
        const opt = yield (0, opt_generator_1.default)(userId);
        (0, email_otp_1.default)(email, profileData.first_name, opt);
        res.json({ status: 'ok' });
    }
    catch (err) {
        console.error('eror generstimg otp', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.generateConfirmEmailOtp = generateConfirmEmailOtp;
// function to confirm email otp
const confirmEmailOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        // @ts-ignore
        const userId = (_c = req.session.user) === null || _c === void 0 ? void 0 : _c.id;
        const otp = parseInt(req.body.otp);
        const email = req.body.email;
        const dbOtp = yield (0, otp_queries_1.queryOtp)(userId);
        console.log('otppppppp', dbOtp, otp);
        if (!email || !otp)
            throw 'incomlete data sent to server';
        const equal = otp === (dbOtp === null || dbOtp === void 0 ? void 0 : dbOtp.otp);
        if (!equal)
            return res.json({ status: equal });
        yield (0, profile_queries_1.querySaveEmailVerify)(userId, email);
        yield (0, otp_queries_1.queryDeleteOtp)(userId);
        res.json({ status: equal });
    }
    catch (err) {
        console.error('error in confirm email OTP', err);
        res.status(500).json({ message: err });
    }
    ;
});
exports.confirmEmailOtp = confirmEmailOtp;
//# sourceMappingURL=email-verification.js.map