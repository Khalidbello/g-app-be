import { queryDeleteOtp, querySaveOtp, querySaveStaffOtp, queryStaffDeleteOtp } from "../services/otp-queries";
import generateRandomAlphanumericCode from "./generate-random-string";

const otpGenerator = async (userId: number, type: 'user' | 'staff' | 'admin', vendorId: number): Promise<number> => {
    return new Promise<number>(async (resolve, reject) => {
        try {
            type === 'user' ? await queryDeleteOtp(userId) : await queryStaffDeleteOtp(userId, type, vendorId);
            // @ts-ignore
            const otp: number = generateRandomAlphanumericCode(4, true);
            const saved: boolean = type === 'user' ? await querySaveOtp(userId, otp) : await querySaveStaffOtp(userId, otp, type, vendorId);

            if (!saved) throw 'failed to save new otp';

            resolve(otp)
        } catch (err) {
            reject(err);
        }
    })
};

export default otpGenerator;