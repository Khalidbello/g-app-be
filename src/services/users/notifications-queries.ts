import pool from "../../modules/connectdb";

// query to add new notificaion
const addNewNotification = (userId: number, title: string, message: string, type: "info" | "warning" | "error" | "success", viewed: boolean, url: string) => {
    return new Promise((resolve, reject) => {
        const date = new Date();
        const query = 'INSERT INTO notifications (user_id, title, message, type, viewed, url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';

        pool.query(query, [userId, title, message, type, viewed, url, date], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};

// 
const queryUserCountUnViewedNoti = (userId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'SELECT COUNT(*) FROM notifications WHERE user_id = ? AND viewed = false';

        pool.query(query, [userId], (err, result) => {
            if (err) return reject(err);

            resolve(result[0]['COUNT(*)'])
        });
    });
};


// funcion to query usr notificaions and order it by data in latest to oldest
const queryUserNotifications = (userId: number, limit: number, pagin: number): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        const query = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';

        pool.query(query, [userId, limit, pagin], (err, result) => {
            if (err) return reject(err);

            resolve(result);
        });
    });
};


// query to set all unviewed notification to viewd
const userQueryUpdateNoteToViewed = (userId: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE notifications SET viewed = true WHERE user_id = ? AND viewed = false ';
        pool.query(query, [userId], (err, result) => {
            if (err) return reject(err);

            resolve(true);
        });
    });
};


// query to set all unviewed notification to viewd
const userQueryUpdateNoteToViewedById = (userId: number, id: number) => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE notifications SET viewed = true WHERE user_id = ? AND viewed = false AND id = ?';
        pool.query(query, [userId, id], (err, result) => {
            if (err) return reject(err);

            resolve(true);
        });
    });
};




export {
    addNewNotification,
    queryUserCountUnViewedNoti,
    queryUserNotifications,
    userQueryUpdateNoteToViewed,
    userQueryUpdateNoteToViewedById
};