import pool from "../../modules/connectdb";
import { queryStaffDataType } from "./staff-queries";

const queryVcDetails = (verificationCode: string) => {
    return new Promise<queryStaffDataType>((resolve, reject) => {
        const query = 'SELECT * FROM staffs WHERE verification_code = ?';

        pool.query(query, [verificationCode], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


// query to activate staff account
const queryActivateStaffAccount = (password: string, vc: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE staffs SET activated = ?, password = ?, verification_code = ? WHERE verification_code = ?';

        pool.query(query, [true, password, '', vc], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryVcDetails,
    queryActivateStaffAccount,
}