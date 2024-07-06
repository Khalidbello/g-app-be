import pool from "../../modules/connectdb";

// query paid orders sorted by payment data
const queryPaidOrders = (vendorId: number, pagin: number, limit: number) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM orders WHERE vendor_id = ?  AND status = paid ORDER BY payment_date DESC LIMIT ? OFFSET ?';

        pool.query(query, [vendorId, limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


export {
    queryPaidOrders,
};