// file to handle all route action related to virtual account

import { Request, Response } from "express";
import { getAcc, saveVAcc } from './../services/v-acc-queries';
import { CustomSessionData } from "../types/session-types";
import { checkUserExistType, vAccountType } from '../types/general';
import { checkUserExist } from "../services/users-queries";

const getVAccDetails = async (req: Request, res: Response) => {
    const email = (req.session as CustomSessionData).user?.email;

    try {
        const details: vAccountType = await getAcc(email);

        if (!details?.account_name) {
            return res.status(404).json({ message: 'virtual account not found' });
        } else {
            res.status(200).json(details);
        };
    } catch (err) {
        res.status(500).json({ message: err });
    }
};


// function to handle creation of virtual account
const createVAcc = async (req: Request, res: Response) => {
    const bvn: string = req.body.bvn;
    const email = (req.session as CustomSessionData).user?.email;
    const Flutterwave = require('flutterwave-node-v3');
    let response;

    console.log('in create v accont');
    try {
        // get user first name and last name
        const user: [checkUserExistType] = await checkUserExist(email);

        if (user.length < 1) return res.status(404).json({ message: 'user details not found' });

        const flw = new Flutterwave(process.env.FLWPTK, process.env.FLWSTK);
        const payload = {
            email: email,
            is_permanent: true,
            bvn: bvn,
            tx_ref: email,
            narration: "virtual account for g-app"
        };

        response = await flw.VirtualAcct.create(payload);
        console.log(response);

        if (response.status === 'success') {
            // @ts-ignore
            const saved: boolean = await saveVAcc('FLW', response.data.account_number, response.data.bank_name, email, email);
            if (saved == true) return res.json({ message: 'virtual account created succesfully' });

            throw 'something went wrong';
        };

        throw 'something went wrong';
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    };
};


export { getVAccDetails, createVAcc };