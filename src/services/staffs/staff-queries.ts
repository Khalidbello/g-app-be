import pool from "../../modules/connectdb";

interface queryStaffDataType {
    id: number;
    first_name: string;
    last_name: string;
    vendor_id: number;
    created_at: Date;
    email: string;
    password: string;
};

const queryStaffData = (staffId: number) => {
    return new Promise<queryStaffDataType>((resolve, reject) => {
        const query = 'SELECT * FROM staffs WHERE id = ?';

        pool.query(query, [staffId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


export {
    queryStaffData,
};

export type { queryStaffDataType }