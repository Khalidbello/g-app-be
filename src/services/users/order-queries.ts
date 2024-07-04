import { query } from "express";
import pool from "../../modules/connectdb";
import { productsType } from "./user-vendor-queries";

// function to save new defined order
const saveDOrder = (gurasa: number, suya: number, name: string, userId: number, date: Date): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO defined_orders (suya, gurasa, name, created, user_id) VALUES (?, ?, ?, ?, ?)'

        pool.query(query, [suya, gurasa, name, date, userId], (err, result) => {
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
        const query = 'SELECT suya, gurasa, name, id FROM defined_orders WHERE user_id = ? ORDER BY created DESC LIMIT ? OFFSET ?';

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
    (userId: number, status: 'placed' | 'paid' | 'bagged' | 'delivered', orders: productsType[], created_date: Date, order_id: string,
        payment_account: string, payment_bank: string, payment_name: string): Promise<{ [keys: string]: string }> => {
        return new Promise<{ [keys: string]: string }>((resolve, reject) => {
            const query = 'INSERT INTO orders (user_id, status, order created_date, order_id, payment_account, payment_bank, payment_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

            pool.query(query, [userId, status, created_date, order_id, payment_account, payment_bank, payment_name], (err, result) => {
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


// query to add a new order to the database
const addNewOrderForVAcc = (user: string, status: string, gurasa: number, suya: number, price: number, created_date: Date, payment_date: Date, order_id: string): Promise<{ [keys: string]: string }> => {
    return new Promise<{ [keys: string]: string }>((resolve, reject) => {
        const query = 'INSERT INTO orders (user, status, gurasa, suya, price, created_date, payment_date, order_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        pool.query(query, [user, status, gurasa, suya, price, created_date, payment_date, order_id], (err, result) => {
            if (err) {
                console.log('an error ocured fetching defined order', err)
                reject(err);
            } else {
                console.log(result);
                resolve(result);
            }
        })
    })
}


// query to fetch user orders 
const getPlacedOrders = (userId: number, limit: number, pagin: number): Promise<[]> => {
    return new Promise<[]>((resolve, reject) => {
        const query = 'SELECT  status, gurasa, suya, price, created_date, order_id, id FROM orders WHERE user_id = ?  ORDER BY created_date DESC LIMIT ? OFFSET ?';

        pool.query(query, [userId, limit, pagin], (err, result) => {
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

const queryOrderById = (userId: number, id: number): Promise<{ [keys: string]: string }> => {
    return new Promise<{ [keys: string]: string }>((resolve, reject) => {
        const query = 'SELECT * FROM orders WHERE user_id = ? AND id = ?';

        pool.query(query, [userId, id], (err, result) => {
            if (err) {
                console.log('an error ocured fetching defined order', err)
                reject(err);
            } else {
                console.log(result);
                resolve(result);
            }
        })
    })
}
export {
    saveDOrder,
    retrieveDOrder,
    deleteDOrder,
    addNewOrderForVAcc,
    getPlacedOrders,
    queryOrderById,
    addNewOrder,
};
