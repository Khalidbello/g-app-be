import pool from "../../modules/connectdb";

type orderType = {
    id: number;
    order_id: string;
    status: 'placed' | 'paid' | 'bagged' | 'delivered';
    created_date: string;
    payment_date: string;
    bagged_data: string;
    deliver_date: string;
    payment_account: string;
    payment_name: string;
    payment_bank: string;
    vendor_id: string;
    order: any;
    last_four: string;
    delivered_by: string;
};


// query paid orders sorted by payment data
const queryPaidOrders = (vendorId: number, pagin: number, limit: number) => {
    return new Promise<orderType[]>((resolve, reject) => {
        const query = 'SELECT * FROM orders WHERE vendor_id = ?  AND status = ? ORDER BY payment_date ASC LIMIT ? OFFSET ?';

        pool.query(query, [vendorId, 'paid', limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


// query paid orders sorted by payment data
const queryBaggedOrders = (vendorId: number, pagin: number, limit: number) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM orders WHERE vendor_id = ?  AND status = ? ORDER BY payment_date ASC LIMIT ? OFFSET ?';

        pool.query(query, [vendorId, 'bagged', limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


// query to update order status to bagged 
const queryVendorOrderToBagged = (staffId: number, vendorId: number, orderKey: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'UPDATE \`orders\` SET status = ?, bagged_by = ?, bagged_date = ? WHERE id = ?';

        pool.query(query, ['bagged', staffId, date, orderKey], (err, resutlt) => {
            if (err) return reject(err);

            resolve(resutlt.affectedRows > 0);
        });
    });
};


// query to change order to dleivered
const queryVendorOrderToDelivered = (staffId: number, vendorId: number, orderKey: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const date = new Date();
        const query = 'UPDATE \`orders\` SET status = ?, delivered_by = ?, deliver_date = ? WHERE id = ?';

        pool.query(query, ['delivered', staffId, date, orderKey], (err, resutlt) => {
            if (err) return reject(err);

            resolve(resutlt.affectedRows > 0);
        });
    });
};


const queryOrderByKey = (id: number): Promise<{ [keys: string]: string }> => {
    return new Promise<{ [keys: string]: string }>((resolve, reject) => {
        const query = 'SELECT * FROM orders WHERE id = ?';

        pool.query(query, [id], (err, result) => {
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


// query orders by last four and user id 
const queryOrderByLastFourAndUserId = (lastFour: string, userId: number) => {
    return new Promise<orderType[]>((resolve, reject) => {
        const query = 'SELECT * FROM orders WHERE last_four = ? AND user_id = ? AND status = ?';

        pool.query(query, [lastFour, userId, 'bagged'], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


// query to retunr order excluding
const queryOrderByUserIdExLastFour = (userId: number, lastFour: string) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM orders WHERE last_four != ? AND user_id = ? AND status = ?';

        pool.query(query, [lastFour, userId, 'bagged'], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};



export {
    queryPaidOrders,
    queryVendorOrderToBagged,
    queryOrderByKey,
    queryVendorOrderToDelivered,
    queryBaggedOrders,
    queryOrderByLastFourAndUserId,
    queryOrderByUserIdExLastFour,
};