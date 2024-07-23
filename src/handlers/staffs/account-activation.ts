import { Request, Response } from "express";
import { queryVendorById } from "../../services/users/user-vendor-queries";
import { queryActivateStaffAccount, queryVcDetails } from "../../services/staffs/account-activation-queries";

// handler fucntion to chek if veification code is valid
const checkVerificationCode = async (req: Request, res: Response) => {
    try {
        const verifictionCode: string = req.params.vc;
        const checkVcExists = await queryVcDetails(verifictionCode);

        if (!checkVcExists) return res.status(404).json({ message: 'No valid use case found for the provided verification code' });

        const vendorInfo = await queryVendorById(checkVcExists.vendor_id);

        res.json({
            vendorName: vendorInfo.name,
            image: Buffer.from(vendorInfo.image).toString('base64'),
            vendorId: vendorInfo.id
        });
    } catch (err) {
        console.error('An error occured confirming verification code', err);
        res.status(500).json({ message: err });
    };
};


// handler to activate account
const activateAccount = async (req: Request, res: Response) => {
    try {
        const { password, confirmPassword, vc } = req.body;
        console.log('in activate staff account', password, confirmPassword, vc);

        if (!password || !confirmPassword || !vc) return res.status(400).json({ mssage: 'Incomplete data sent to servr for processing' });
        if (password !== confirmPassword) return res.status(401).json({ message: 'password mismatch' });

        const activated = await queryActivateStaffAccount(password, vc);

        if (!activated) throw 'An error occured acitvating staff account';

        res.json({ message: 'Account activation succesfull' });
    } catch (err) {
        console.error('An error occured account activation', err);
        res.status(500).json({ message: err });
    };
};

export {
    checkVerificationCode,
    activateAccount,
}