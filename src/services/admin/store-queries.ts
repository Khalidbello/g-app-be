import pool from "../../modules/connectdb";

interface vendorImageType {
    vendor_id: number;
    image: Blob;
    created_at: Date;
};

const checkDpExists = (vendorId: number) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM vendor_image WHERE vendor_id = ?';

        pool.query(query, [vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]['COUNT(*)'])
        });
    });
};


// query get vendor Id
const queryGetVendorDp = (vendorId: number): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM vendor_image WHERE vendor_id = ? LIMIT 1';

        pool.query(query, [vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


// to insert new vendor dp
const queryAddVendorDp = (vendorId: number, imageBuffer: Buffer) => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO vendor_image (image, vendor_id, created_at) VALUES (?, ?, ?)';

        pool.query(query, [imageBuffer, vendorId, date], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// to update vendor dp
const queryUpdateVendorImaage = (userId: number, imageBuffer: Buffer) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE vendor_image SET image = ? WHERE vendor_id = ?';

        pool.query(query, [imageBuffer, userId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// query to update user info
const queryUpdateVendorInfo = (vendorId: number, vendorName: string, shortIntro: string, aboutVendor: string, address: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE vendors SET name = ?, short_intro = ?, about = ?, address = ? WHERE id = ?';

        pool.query(query, [vendorName, shortIntro, aboutVendor, address, vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    checkDpExists,
    queryUpdateVendorImaage,
    queryAddVendorDp,
    queryGetVendorDp,
    queryUpdateVendorInfo,
};