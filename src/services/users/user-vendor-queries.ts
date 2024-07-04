import pool from "../../modules/connectdb";


interface getVendors {
    id: number;
    about: string;
    name: string;
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


interface productsTypes {
    id: number;
    vendor_id: number;
    name: string;
    price: number;
};

const queryUserVenorProucts = (vendorId: number, pagin: number, limit: number): Promise<productsTypes> => {
    return new Promise<productsTypes>((resolve, reject) => {
        const query = 'SELECT * FROM products WHERE vendor_id = ? LIMIT ? OFFSET ?';

        pool.query(query, [vendorId, limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        })
    })
}

export {
    queryVendors,
    queryUserVenorProucts,
}