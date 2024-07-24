


import pool from "../modules/connectdb";

const queryDeleteOtp = (userId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM otp WHERE user_id = ?';

        pool.query(query, [userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0);
            }
        })
    })
}

const querySaveOtp = async (userId: number, otp: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO otp (user_id, otp, date) VALUES (?, ?, ?)';

        pool.query(query, [userId, otp, date], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0);
            }
        })
    })
}

interface queryOtpType {
    user_id: number;
    otp: number;
    date: Date
}

const queryOtp = async (userId: number): Promise<queryOtpType> => {
    return new Promise<queryOtpType>((resolve, reject) => {
        const query = 'SELECT user_id, otp, date FROM otp WHERE user_id = ?'

        pool.query(query, [userId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0])
            };
        });
    });
};



// query to save staff otp
const querySaveStaffOtp = async (userId: number, otp: number, type: 'staff' | 'admin', vendorId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO staff_otp (staff_id, otp, type, created_at, vendor_id) VALUES (?, ?, ?, ?, ?)';

        pool.query(query, [userId, otp, type, date, vendorId], (err, result) => {
            if (err) return reject(err)

            resolve(result.affectedRows > 0);
        });
    });
};



interface queryStaffOtpType {
    staff_id: number;
    otp: number;
    created_at: Date
    type: 'staff' | 'admin';
};

const queryStaffOtp = async (staff_id: number, type: 'staff' | 'admin', vendorId: number) => {
    return new Promise<queryStaffOtpType>((resolve, reject) => {
        const query = 'SELECT * FROM staff_otp WHERE staff_id = ? AND type = ? AND vendor_id = ?';

        pool.query(query, [staff_id, type, vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};

const queryStaffDeleteOtp = (staff_id: number, type: 'staff' | 'admin', vendorId: number): Promise<boolean> => {
    console.log('in delere staff  otp', staff_id, type, vendorId);
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM staff_otp WHERE staff_id = ? AND type = ? AND vendor_id = ?';

        pool.query(query, [staff_id, type, vendorId], (err, result) => {
            if (err) return reject(err)

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryDeleteOtp,
    querySaveOtp,
    queryOtp,
    querySaveStaffOtp,
    queryStaffOtp,
    queryStaffDeleteOtp,
}