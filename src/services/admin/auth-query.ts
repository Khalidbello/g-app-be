import pool from "../../modules/connectdb";

interface amdinType {
    id: number;
    first_name: string;
    last_name: string;
    vendor_id: number;
    email: string;
    created_at: Date;
    password: string;
    type: string;
}

const queryAdmin = (email: string, vendorId: number) => {
    return new Promise<amdinType>((resolve, reject) => {
        const query = 'SELECT * FROM staffs WHERE email = ? AND vendor_id = ? AND type = ?';

        pool.query(query, [email, vendorId, 'admin'], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


export {
    queryAdmin
}