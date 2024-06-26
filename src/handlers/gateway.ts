import { Request, Response } from "express";
import { CustomSessionData } from "../types/session-types";
import { queryUserProfile } from "../services/users/profile-queries";
import generateRandomAlphanumericCode from "../modules/generate-random-string";
import { addNewOrder } from "../services/users/order-queries";
const Flutterwave = require('flutterwave-node-v3');
const fs = require('fs');

const generateOneTimeAcc = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const userId: number = (req.session as CustomSessionData).user?.id;
        const { gurasaNum, suyaNum } = req.params;
        const data = fs.readFileSync('prices.json', 'utf8'); // Read file synchronously
        const priceData = JSON.parse(data); // Parse JSON string

        const price: number = parseInt(gurasaNum) * priceData.gurasa + parseInt(suyaNum) * priceData.suya;
        console.error('amunt.......', price);
        const userInfo = await queryUserProfile(userId);

        const details = {
            tx_ref: generateRandomAlphanumericCode(10, false),
            amount: price,
            email: userInfo.email,
            fullname: userInfo.first_name + ' ' + userInfo.last_name,
            currency: 'NGN',
            meta: {
                gurasaNum,
                suyaNum,
                userId: userInfo.id,
            },
        };
        const flw = new Flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SCRT_KEY);

        const response = await flw.Charge.bank_transfer(details); console.log('accoint detauls :', response)
        const date = new Date();
        // @ts-ignoreF
        const orderId: string = generateRandomAlphanumericCode(15, false);

        console.error('one time account response', response);
        if (response.status === 'success') {
            const newOrder = await addNewOrder(userId, 'placed', parseFloat(gurasaNum), parseInt(suyaNum), price, date,
                orderId, response.meta.authorization.transfer_acount, response.meta.authorization.transfer_bank, 'Futterwave/eGurasa');

            return res.json({
                accountName: 'eGurasa FLw',
                accountNumber: response.meta.authorization.transfer_account,
                bankName: response.meta.authorization.transfer_bank,
                amount: response.meta.authorization.transfer_amount,
                id: newOrder.affectedRows,
                orderId: orderId,
            });
        };
        throw 'error in creating virtual acount'
    } catch (err) {
        console.log('error in generate one time account number', err);
        res.status(500).json({ message: err });
    }
}


// function to responsd ti webhok event
const webhookHandler = async (req: Request, res: Response) => {
    try {
        console.log('am in webhook');
        const signature = req.headers['verif-hash'];
        let payload;
        let meta;

        if (!signature || signature != process.env.FLW_H) {
            // This request isn't from Flutterwave; discard
            console.log('webhook rejectd not from a trusted source');
            return res.status(401).end();
        };

        payload = req.body;
        console.log('webhook payload', payload);

        if (payload.status !== "successful") return console.log('payment failed..... in webhook handler.......');

        const id = payload.id;
        const reference = Number(payload.txRef);
        const amount = Number(payload.amount);

        // reverify payment
        const flw = new Flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SCRT_KEY);

        const response = await flw.Transaction.verify({ id: id });
        console.log('transaction details', response);

        if (response.status !== 'success') return console.log('error occured while confirming tansacion');

        if (response.data.status !== "successful") return console.log("transaction not successfully carried out: in wallet top up");
    } catch (err) {
        console.log('error in webhook', err);
    };
};


export {
    generateOneTimeAcc,
    //   webhookHandler
}