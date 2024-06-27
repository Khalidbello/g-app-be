import pool from "../../modules/connectdb";

// query to update order status
const updateOrderPaid = (userId: number, orderId: string) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const query = 'UPDATE orders SET status = ?, payment_date = ? WHERE user_id = ? AND order_id = ?';

        pool.query(query, ['paid', date, userId, orderId], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


export {
    updateOrderPaid
}