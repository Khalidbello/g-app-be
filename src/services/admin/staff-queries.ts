import pool from "../../modules/connectdb";


// query to check if staff exists
const queryAdminStaffExist = (email: string, vendorId: number) => {
    return new Promise<number>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM staffs WHERE email = ? AND vendor_id = ?';

        pool.query(query, [email, vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]['COUNT(*)']);
        });
    });
};


// query to create new staff
const queryAdminCreateUser = (vendorId: number, firstName: string, lastName: string, email: string, password: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO staffs (vendor_id, first_name, last_name, email, password, created_at) VALUES (?, ?, ?, ?, ?,?)';

        pool.query(query, [vendorId, firstName, lastName, email, password, date], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryAdminStaffExist,
    queryAdminCreateUser,
}