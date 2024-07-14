import pool from "../../modules/connectdb";

interface productType {
    id: number;
    index: number;
    name: string;
    price: number;
    vendor_id: number;
};


const queryProductInfoByIndexAndVendorId = (vendorId: number, index: number) => {
    return new Promise<productType>((resolve, reject) => {
        const query = 'SELECT * FROM products WHERE vendor_id = ? AND index = ?';

        pool.query(query, [vendorId, index], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


// query to save new product
const queryAddNewProduct = (name: string, price: number, index: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = '';

        pool.query(query, [], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};

export {
    queryProductInfoByIndexAndVendorId,
    queryAddNewProduct,
}