import { Response, Request } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryAddNewProduct, queryProductInfoByIndexAndVendorId } from "../../services/admin/product-queries";

// funciton to respond to products storage
const addNewProduct = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const { name, price, index, } = req.body;

        if (!name || !price || !index) return res.status(400).json({ message: 'incompelete data sent to sever for procesing' });

        // check if they already exists product with index
        const checkExistingIndex = await queryProductInfoByIndexAndVendorId(vendorId, index);

        if (checkExistingIndex) return res.status(401).json({ message: 'produt with index alredy exists' });

        const saved = queryAddNewProduct(name, price, index);

        if (!saved) throw 'Something wnet wrong saving order';
        res.json({ message: 'produt saved successully' });
    } catch (err) {
        console.error('an error occured in add new product', err);
        res.status(500).json({ message: err });
    };
};


// funtion to update product image 
const updateProductImage = (req: Request, res: Response) => {
    try {

    } catch (err) {
        console.error('an error occured in updating product image', err);
        res.status(500).json({ message: err });
    };
};


export {
    addNewProduct,
    updateProductImage,
}