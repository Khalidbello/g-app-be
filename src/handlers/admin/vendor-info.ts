import { Request, Response, NextFunction } from "express";
import { queryVendorData } from "../../services/vendors/vendor-queries";
import { CustomSessionData } from "../../types/session-types";
import * as fs from 'fs/promises';
import formidable from 'formidable';
import { checkDpExists, queryAddVendorDp, queryGetVendorDp, queryUpdateVendorImaage, queryUpdateVendorInfo } from "../../services/admin/store-queries";

const form = formidable();


const getVendorinfo = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId
        const vendorData = await queryVendorData(vendorId);

        res.json(vendorData)
    } catch (err) {
        console.error('error in getting vendor info', err);
        res.status(500).json({ message: 'Something went wrong' });
    };
};



// route to retunr user profile pucture 
const getVendorDp = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const userDp = await queryGetVendorDp(vendorId);

        if (!userDp) return res.status(404).json({ message: 'not dp found' });

        userDp.image = Buffer.from(userDp.image).toString('base64');

        res.json(userDp);
    } catch (err) {
        console.error('error in getting vendor do', err);
        res.status(500).json({ message: err });
    };
};


// funciton to uplaod user dp
const uploadVendorDp = async (req: Request, res: Response) => {
    try {
        const data: any = await new Promise((resolve, reject) => {
            form.parse(req, (err: Error, formFields: any, formFiles: any) => {
                if (err) {
                    return reject(err);
                }
                resolve({ fields: formFields, files: formFiles });
            });
        });

        //@ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const file = data.files.dp[0];

        if (!vendorId || !file) return res.status(400).json({ message: 'Incomplete data sent to server for processing' });

        const imageBuffer = await fs.readFile(file.filepath);
        const dpExists = await checkDpExists(vendorId);
        let saved;

        if (dpExists) {
            saved = queryUpdateVendorImaage(vendorId, imageBuffer);
        } else {
            saved = queryAddVendorDp(vendorId, imageBuffer);
        };

        if (!saved) throw 'Error saving user dp';

        res.json({ message: 'image uploaded succesfully' });
    } catch (err) {
        console.error('error user image upload', err);
        res.status(500).json({ message: err });
    };
};  // end of uploadVendorDp


// function to update vendor info
const updateVendorInfo = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const { vendorName, shortIntro, aboutVendor, address } = req.body;

        if (!vendorName || !shortIntro || !aboutVendor || !address) return res.status(401).json({ message: 'Incomplete data sent to server for processing.' });

        const updated = await queryUpdateVendorInfo(vendorId, vendorName, shortIntro, aboutVendor, address);

        if (!updated) res.status(400).json({ message: 'Something went wrong.' });
        res.json({ message: 'vendor info successfully updated.' })
    } catch (err) {
        console.error('error update vendor info', err);
        res.status(500).json({ message: err });
    };
};

export {
    getVendorinfo,
    uploadVendorDp,
    getVendorDp,
    updateVendorInfo,
}