import pool from "../../modules/connectdb";

// query to change staff password
const queryChangeStaffPassword = (staffId: number, newPassword: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE staffs SET password = ? WHERE id = ?';

        pool.query(query, [newPassword, staffId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryChangeStaffPassword,
};