import pool from "../../modules/connectdb";

// query paid orders sorted by payment data
const queryPaidOrders = (vendorId: number, pagin: number, limit: number) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM orders WHERE vendor_id = ?  AND status = ? ORDER BY payment_date ASC LIMIT ? OFFSET ?';

        pool.query(query, [vendorId, 'paid', limit, pagin], (err, result) => {
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

export {
    queryPaidOrders,
    queryVendorOrderToBagged,
    queryOrderByKey,
};