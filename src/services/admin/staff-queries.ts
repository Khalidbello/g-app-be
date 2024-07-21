import pool from "../../modules/connectdb";

// query t fethc staff 
const queryStaffs = (vendorId: number, pagin: number, limit: number) => {
    return new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM staffs WHERE vendor_id = ? AND type = ? LIMIT ? OFFSET ?';

        pool.query(query, [vendorId, 'staff', limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


// query to check if staff exists
const queryAdminStaffExist = (email: string, vendorId: number) => {
    return new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM staffs WHERE email = ? AND vendor_id = ?';

        pool.query(query, [email, vendorId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]);
        });
    });
};


// query to create new staff
const queryAdminCreateStaff = (vendorId: number, firstName: string, lastName: string, email: string, password: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO staffs (vendor_id, first_name, last_name, email, password, type,  created_at, activated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        pool.query(query, [vendorId, firstName, lastName, email, password, 'staff', date, false], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// query to update staff 
const queryUpdateStaff = (firstName: number, lastName: string, email: string, password: string, staffId: number, vendorId: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'UPDATE staffs set first_name = ?, last_name = ?, email = ?, password = ? WHERE vendor_id = ? AND id = ?';

        pool.query(query, [firstName, lastName, email, password, vendorId, staffId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


// query to remove staff 
const queryRemoveStaff = (staffId: number, vendorId: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM staffs WHERE vendor_id = ? AND id = ?';

        pool.query(query, [vendorId, staffId], (err, result) => {
            if (err) return reject(err);

            resolve(result.affectedRows > 0);
        });
    });
};


interface staffType {
    id: number;
    first_name: string;
    last_name: string;
    vendor_id: number;
    email: string;
    created_at: Date;
    password: string;
};

const queryStaffForActivation = (email: string, vendorId: number): Promise<staffType> => {
    console.log('inquery email, vendorId', email, vendorId);
    return new Promise<staffType>((resolve, reject) => {
        const query = 'SELECT * FROM staffs WHERE email = ? AND vendor_id = ? AND activated != ?';

        pool.query(query, [email, vendorId, true], (err, result) => {
            if (err) return reject(err)

            resolve(result[0]);
        });
    });
};



const querySaveAccActivationCode = async (id: number, accActivationCode: string) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE staffs SET verification_code = ? WHERE id = ? AND activated != ?';

        pool.query(query, [accActivationCode, id, true], (err, result) => {
            if (err) return reject(err)

            resolve(result.affectedRows > 0);
        });
    });
};


export {
    queryStaffs,
    queryAdminStaffExist,
    queryAdminCreateStaff,
    queryUpdateStaff,
    queryRemoveStaff,
    queryStaffForActivation,
    querySaveAccActivationCode,
};