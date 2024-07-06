import pool from "../../modules/connectdb";


// function to save new defined order
const saveDOrder = (userId: number, vendorId: number, vendorName: string, name: string, order: string, date: Date): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO defined_orders (user_id, vendor_id, vendor_name, name, \`order\`, created_at) VALUES (?, ?, ?, ?, ?, ?)';

        pool.query(query, [userId, vendorId, vendorName, name, order, date], (err, result) => {
            if (err) {
                console.log('an error occured trying to create new defined order', err);
                reject(err);
            } else {
                console.log(result);
                resolve(result.affectedRows > 0);
            };
        });
    });
};


// function to retrieve defined order
const retrieveDOrder = (count: number, limit: number, userId: number): Promise<[]> => {
    return new Promise<[]>((resolve, reject) => {
        const query = 'SELECT * FROM defined_orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';

        pool.query(query, [userId, limit, limit * count], (err, result) => {
            if (err) {
                console.log('an error ocured fetching defined order', err)
                reject(err);
            } else {
                console.log(result);
                resolve(result);
            };
        });
    });
};


// query to delete order
const deleteDOrder = (id: number, userId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM defined_orders WHERE id = ? AND user_id = ?';

        pool.query(query, [id, userId], (err, result) => {
            if (err) {
                console.log('an error ocured fetching defined order', err)
                reject(false);
            } else {
                console.log(result);
                resolve(result.affectedRows > 0);
            }
        })
    })
}


// add new order for one time account query
const addNewOrder =
    (userId: number, vendorId: number, vendorName: string, status: 'placed' | 'paid' | 'bagged' | 'delivered', orders: string, created_date: Date, order_id: string,
        payment_account: string, payment_bank: string, payment_name: string): Promise<{ [keys: string]: string }> => {
        return new Promise<{ [keys: string]: string }>((resolve, reject) => {
            const query = 'INSERT INTO orders (user_id, vendor_id, vendor_name, status, \`order\`, created_date, order_id, payment_account, payment_bank, payment_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

            pool.query(query, [userId, vendorId, vendorName, status, orders, created_date, order_id, payment_account, payment_bank, payment_name], (err, result) => {
                if (err) {
                    console.error('an error ocured fetching defined order', err)
                    reject(err);
                } else {
                    console.log(result);
                    resolve(result);
                };
            });
        });
    };


const addNewOrderForVAcc = (
    userId: number, vendorId: number, vendorName: string, status: string, order: string, created_date: Date, payment_date: Date, order_id: string, accountName: string,
    accountNumber: string, bankName: string
): Promise<{ [keys: string]: string }> => {
    return new Promise<{ [keys: string]: string }>((resolve, reject) => {
        const query = 'INSERT INTO orders (user_id, vendor_id, vendor_name, status, \`order\`, created_date, payment_date, order_id, payment_bank, payment_name, payment_account) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        pool.query(query, [userId, vendorId, vendorName, status, order, created_date, payment_date, order_id, bankName, accountName, accountNumber], (err, result) => {
            if (err) {
                console.log('An error occurred while adding the order', err);
                reject(err);
            } else {
                console.log(result);
                resolve(result);
            }
        });
    });
};


// query to fetch user orders 
const getPlacedOrders = (userId: number, limit: number, pagin: number): Promise<[]> => {
    return new Promise<[]>((resolve, reject) => {
        const query = 'SELECT  status, \`order\`, created_date, order_id, id FROM orders WHERE user_id = ?  ORDER BY created_date DESC LIMIT ? OFFSET ?';

        pool.query(query, [userId, limit, pagin], (err, result) => {
            if (err) {
                console.log('an error ocured fetching recent orders order', err)
                reject(err);
            } else {
                console.log(result);
                resolve(result);
            };
        });
    });
};

const queryOrderById = (userId: number, id: number): Promise<{ [keys: string]: string }> => {
    return new Promise<{ [keys: string]: string }>((resolve, reject) => {
        const query = 'SELECT * FROM orders WHERE user_id = ? AND id = ?';

        pool.query(query, [userId, id], (err, result) => {
            if (err) {
                console.log('an error ocured fetching defined order', err)
                reject(err);
            } else {
                console.log(result);
                resolve(result[0]);
            }
        })
    })
};


export {
    saveDOrder,
    retrieveDOrder,
    deleteDOrder,
    addNewOrderForVAcc,
    getPlacedOrders,
    queryOrderById,
    addNewOrder,
};
