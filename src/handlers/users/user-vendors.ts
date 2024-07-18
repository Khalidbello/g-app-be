import { Request, Response } from "express";
import { queryUserVenorProucts, queryVendorById, queryVendors } from "../../services/users/user-vendor-queries";
import { queryProducts } from "../../services/admin/product-queries";

const getVendors = async (req: Request, res: Response) => {
    try {
        const { limit, pagin } = req.params;

        if (!limit || !pagin) return res.status(400).json({ message: 'incomplete data sent to sever for processng.' });

        const vendors = await queryVendors(parseInt(limit), parseInt(pagin));

        res.json(vendors);
    } catch (err) {
        console.error('error in get vendors', err)
        res.status(500).json({ message: err });
    };
};



const getProducts = async (req: Request, res: Response) => {
    try {
        const { vendorId, pagin, limit } = req.params;
        const products = await queryProducts(parseInt(vendorId), parseInt(pagin), parseInt(limit));
        const length: number = products.length;

        for (let i = 0; i < length; i++) {
            // @ts-ignore
            products[i].image = products[i].image ? Buffer.from(products[i].image).toString('base64') : null;
        };

        res.json(products);
    } catch (err) {
        console.error('error in get produts', err)
        res.status(500).json({ message: err });
    };
};


// fucniton handler to respond to vendor info
const getVendorInfo = async (req: Request, res: Response) => {
    try {
        const vendorId: number = parseInt(req.params.vendorId);
        const vendorData = await queryVendorById(vendorId);
        vendorData.image = Buffer.from(vendorData.image).toString('base64');

        res.json(vendorData);
    } catch (err) {
        console.error('error in get vendor info', err)
        res.status(500).json({ message: err });
    };
};


export {
    getVendors,
    getProducts,
    getVendorInfo,
}; 