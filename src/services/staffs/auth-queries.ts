import pool from "../../modules/connectdb";

interface staffType {
    id: number;
    first_name: string;
    last_name: string;
    vendor_id: number;
    email: string;
    created_at: Date;
    password: string;
}

const queryStaff = (email: string, vendorId: number): Promise<staffType> => {
    return new Promise<staffType>((resolve, reject) => {
        const query = 'SELECT * FROM staffs WHERE email = ? AND vendor_id = ? AND activated = ?';

        pool.query(query, [email, vendorId, true], (err, result) => {
            if (err) return reject(err)

            resolve(result[0]);
        });
    });
};


export {
    queryStaff
};