import { Response, Request } from "express";
import { CustomSessionData } from "../../types/session-types";
import { queryAddNewProduct, queryAddProductImage, queryDeleteProduct, queryEditProduct, queryProductImage, queryProductInfoByIndexAndVendorId, queryProducts, queryProdutImageExists, queryUpdateProductImaage } from "../../services/admin/product-queries";
import * as fs from 'fs/promises';
import formidable from 'formidable';

const form = formidable();


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

        const saved = queryAddNewProduct(vendorId, name, price, index);

        if (!saved) throw 'Something wnet wrong saving order';
        res.json({ message: 'produt saved successully' });
    } catch (err) {
        console.error('an error occured in add new product', err);
        res.status(500).json({ message: err });
    };
};


// functon to handle getting of products
const getProducts = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const { pagin, limit } = req.params;
        const products = await queryProducts(vendorId, parseInt(pagin), parseInt(limit));

        res.json(products);
    } catch (err) {
        console.error('an error occured in get products', err);
        res.status(500).json({ message: err });
    };
};

// funtion to update product image 
const updateProductImage = async (req: Request, res: Response) => {
    try {
        const files: any = await new Promise((resolve, reject) => {
            form.parse(req, (err: any, fields: any, files: any) => {
                if (err) reject(err);

                resolve(files)
            });
        });

        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const productId: number = parseInt(req.params.productId);
        const image = files.image[0];

        if (!vendorId || !productId || !image) return res.status(400).json({ message: 'Incmplete data sent to server for processing' });

        // check if dp exits for product bfore#
        const imageExists = await queryProdutImageExists(productId, vendorId);
        const imageBuffer = await fs.readFile(image.filepath);
        let saved: boolean;

        if (imageExists) {
            saved = await queryUpdateProductImaage(productId, vendorId, imageBuffer);
        } else {
            saved = await queryAddProductImage(productId, vendorId, imageBuffer);
        };

        if (!saved) throw 'Something went wrong updating image';
        res.json({ message: 'product image updated successfuly' });
    } catch (err) {
        console.error('an error occured in updating product image', err);
        res.status(500).json({ message: err });
    };
};


// function to return product image 
const getProductImage = async (req: Request, res: Response) => {
    try {
        const productId: number = parseInt(req.params.productId);

        const result = await queryProductImage(productId);

        if (!result) return res.status(404).json({ message: 'No image found for this product' });

        result.image = Buffer.from(result.image).toString('base64');
        res.json({ image: result });
    } catch (err) {
        console.error('an error occured getting product image', err);
        res.status(500).json({ message: err });
    };
};


// funtion to handle prodict edit 
const editProduct = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const productId: number = parseInt(req.params.productId);
        const { name, index, price } = req.body;

        if (!vendorId || !productId || !name || !index || !price) return res.status(400).json({ message: 'incomplete data sent to server for processing' });

        const edited = await queryEditProduct(vendorId, productId, name, index, price);

        if (!edited) throw 'Something went wrong updating product';
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        console.error('an error occured edit product', err);
        res.status(500).json({ message: err });
    };
};


// function handler to delete produt
const deleteProduct = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const vendorId: number = (req.session as CustomSessionData).user?.vendorId;
        const productId: number = parseInt(req.params.productId);

        const deleted = await queryDeleteProduct(productId, vendorId);

        if (!deleted) throw 'Something went wrong try again';

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('an error occured delete product', err);
        res.status(500).json({ message: err });
    };
};


export {
    addNewProduct,
    updateProductImage,
    getProducts,
    getProductImage,
    editProduct,
    deleteProduct,
};