import { Request, Response, query } from "express";
import { CustomSessionData } from "../../types/session-types";
import { querySaveEmailVerify, queryUserProfile } from "../../services/users/profile-queries";
import otpGenerator from "../../modules/opt-generator";
import emailOtpSender from "../../modules/emailers/email-otp";
import { queryDeleteOtp, queryOtp } from "../../services/otp-queries";


const getCheckEmailVerify = async (req: Request, res: Response) => {
    try {
        const userId = (req.session as CustomSessionData).user?.id;

        // @ts-ignore
        const profieData = await queryUserProfile(userId);

        if (profieData?.email_verified) {
            res.json({ status: true, email: profieData?.email })
        } else {
            res.json({ status: false, email: profieData.email })
        };
    } catch (err) {
        console.error('error in check if email verified', err);
        res.status(500).json({ message: err });
    };
};


const generateConfirmEmailOtp = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const { email } = req.body;

        const profileData = await queryUserProfile(userId)
        const opt: number = await otpGenerator(userId, 'user', 0);
        emailOtpSender(email, profileData.first_name, opt);

        res.json({ status: 'ok' })
    } catch (err) {
        console.error('eror generstimg otp', err)
        res.status(500).json({ message: err });
    };
};


// function to confirm email otp
const confirmEmailOtp = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const otp: number = parseInt(req.body.otp);
        const email = req.body.email;
        const dbOtp = await queryOtp(userId);
        console.log('otppppppp', dbOtp, otp)
        if (!email || !otp) throw 'incomlete data sent to server';

        const equal: boolean = otp === dbOtp?.otp;

        if (!equal) return res.json({ status: equal });

        await querySaveEmailVerify(userId, email);
        await queryDeleteOtp(userId)
        res.json({ status: equal })
    } catch (err) {
        console.error('error in confirm email OTP', err);
        res.status(500).json({ message: err })
    };
};


export {
    getCheckEmailVerify,
    generateConfirmEmailOtp,
    confirmEmailOtp,
};