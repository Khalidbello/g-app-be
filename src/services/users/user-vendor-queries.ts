import pool from "../../modules/connectdb";


interface getVendors {
    id: number;
    about: string;
    name: string;
    image: string;
    created_at: Date;
};

const queryVendors = (limit: number, pagin: number): Promise<getVendors> => {
    return new Promise<getVendors>((resolve, reject) => {
        const query = 'SELECT * FROM vendors LIMIT ? OFFSET ?';

        pool.query(query, [limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


const queryVendorById = (id: number): Promise<getVendors> => {
    return new Promise<getVendors>((resolve, reject) => {
        const query = 'SELECT * FROM vendors WHERE id =?';

        pool.query(query, [id], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


interface productsType {
    id: number;
    vendor_id: number;
    name: string;
    price: number;
};

const queryUserVenorProucts = (vendorId: number, pagin: number, limit: number): Promise<productsType[]> => {
    return new Promise<productsType[]>((resolve, reject) => {
        const query = 'SELECT * FROM products WHERE vendor_id = ? LIMIT ? OFFSET ?';

        pool.query(query, [vendorId, limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};

const queryUserVenorProuctsById = (productId: number, vendorId: number): Promise<productsType> => {
    return new Promise<productsType>((resolve, reject) => {
        const query = 'SELECT * FROM products WHERE id = ? AND vendor_id = ?';

        pool.query(query, [productId, vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        })
    })
}

export {
    queryVendorById,
    queryVendors,
    queryUserVenorProucts,
    queryUserVenorProuctsById,
};

export type {
    productsType,
}