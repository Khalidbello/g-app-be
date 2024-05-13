// file to handle all route action related to virtual account

import { Request, Response } from "express";
import { getAcc } from './../services/v-acc-queries';
import { CustomSessionData } from "../types/session-types";
import { vAccountType } from './../types/v-account-types';

const getVAccDetails = async (req: Request, res: Response) => {
    const email = (req.session as CustomSessionData).user?.email;
    const details: vAccountType = await getAcc(email);

    console.log(details, 'below wait');
    if (!details?.account_name) {
        return res.status(404).json({ message: 'virtual account not found' });
    } else {
        res.status(200).json(details);
    };
};

export { getVAccDetails };