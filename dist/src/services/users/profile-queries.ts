import pool from "../../modules/connectdb";

interface queryUserProfileType {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    joined: string;
    phone_number: string;
    password: string;
    gender: string;
    email_verified: boolean;
}

const queryUserProfile = (userId: number): Promise<queryUserProfileType> => {
    return new Promise<queryUserProfileType>((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE id = ?';

        pool.query(query, [userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result[0])
            }
        })
    })
}


// const function to change user email verified to true
const querySaveEmailVerify = (userId: number, email: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE users SET email_verified = ?, email = ? WHERE id = ?';

        pool.query(query, [true, email, userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0)
            }
        })
    })
}


// query to update user password
const queryUpdatePassword = (userId: number, newPassword: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE users SET password = ? WHERE id = ?';

        pool.query(query, [newPassword, userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0)
            }
        })
    })
}


// query to handle to change user name
const queryUpdateUserNames = (userId: number, firstName: string, lastName: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?';

        pool.query(query, [firstName, lastName, userId], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result.affectedRows > 0)
            }
        })
    })
}

// query chck if user has dp
const queryUserDp = (userId: number): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM user_dp WHERE id = ? LIMIT 1';

        pool.query(query, [userId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};

// query to upload user image
const queryUserSaveDp = (userId: number, imageBuffer: Buffer) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO user_dp (user_id, dp) VALUES (?, ?)';

        pool.query(query, [userId, imageBuffer], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};

// to update user dp
const queryUpdateUserDp = (userId: number, imageBuffer: Buffer) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE user_dp SET dp = ? WHERE user_id = ?';

        pool.query(query, [imageBuffer, userId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};



export {
    queryUserProfile,
    querySaveEmailVerify,
    queryUpdatePassword,
    queryUpdateUserNames,
    queryUserSaveDp,
    queryUpdateUserDp,
    queryUserDp,
}

export type {
    queryUserProfileType,
}