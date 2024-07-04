import { Request, Response } from "express";
import { queryUserVenorProucts, queryVendors } from "../../services/users/user-vendor-queries";

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
        const products = await queryUserVenorProucts(parseInt(vendorId), parseInt(pagin), parseInt(limit));

        res.json(products);
    } catch (err) {
        console.error('error in get produts', err)
        res.status(500).json({ message: err });
    };
};

export {
    getVendors,
    getProducts,
}; 