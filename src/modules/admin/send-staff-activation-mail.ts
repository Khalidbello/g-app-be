const handleBars = require('handlebars');
const fs = require('fs');
import { querySaveAccActivationCode, queryStaffForActivation } from "../../services/admin/staff-queries";
import { queryVendorInfoById } from "../../services/admin/store-queries";
import { queryVcDetails } from "../../services/staffs/account-activation-queries";
import sendEmail from "../emailers/email-sender";
import generateRandomAlphanumericCode from "../generate-random-string";

const staffAccountVerificationLinkSender = async (vendorId: number, staffEmail: string) => {
    try {
        console.log('in verification email sender', vendorId, staffEmail)
        // @ts-ignore
        let code: string = generateRandomAlphanumericCode(20, false);
        let loop = true; // flag to determine wether loop continues or break
        let count = 0  // to keep count of hw many time the loop have run

        // check if staff with code already exit if true regenerate
        while (loop) {
            const condition = await queryVcDetails(code);
            if (!condition) loop = false;
            if (count > 5) return false;
            count++;
        };

        const vendorInfo = await queryVendorInfoById(vendorId);
        const staffInfo = await queryStaffForActivation(staffEmail, vendorId);

        if (!vendorInfo || !staffInfo) {
            console.log('in send verification link', vendorInfo, staffInfo);
            return false;
        };

        // query to save activation code
        await querySaveAccActivationCode(staffInfo.id, code);

        let courseEnrollTemp: string = await fs.promises.readFile('email-templates/staff-activation-link-template.hbs', 'utf8',);

        console.log('temp', courseEnrollTemp)
        const compiledTemp = handleBars.compile(courseEnrollTemp);
        const html = compiledTemp({
            vendorName: vendorInfo.name,
            companyName: process.env.COMPANY_NAME,
            staffName: '',
            activationLink: process.env.HOST + '/staff-account-activation?vc=' + code,
            supportEmail: process.env.SUPPORT_EMAIL,
            supportPhone: process.env.SUPPORT_PHONE,
            senderName: '',
            senderContactInfo: ''
        });
        console.log('activation link template html', html);

        // @ts-ignore
        sendEmail(process.env.ADMIN_EMAIL, process.env.ADMIN_MAIL_P, staffInfo.email, 'Staff Account Activation Mail ', html);
        return true
    } catch (err) {
        console.error('errror sending email in corse enroll email', err);
        return false;
    };
};

export default staffAccountVerificationLinkSender;