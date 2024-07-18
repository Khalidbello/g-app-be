import pool from "../../modules/connectdb";

interface queryVendorDataType {
    id: number;
    name: string;
    about: string;
    short_intro: string;
    created_at: Date;
    image: string;
};


const queryVendorData = (vendorId: number) => {
    return new Promise<queryVendorDataType>((resolve, reject) => {
        const query = 'SELECT * FROM vendors WHERE id = ?';

        pool.query(query, [vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


export {
    queryVendorData,
};