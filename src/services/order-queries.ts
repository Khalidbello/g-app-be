import pool from "../modules/connectdb";

// function to save new defined order
const saveDOrder = (gurasa: number, suya: number, name: string, email: string | undefined, date: Date): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO defined_orders (suya, gurasa, name, created, email) VALUES (?, ?, ?, ?, ?)'

        pool.query(query, [suya, gurasa, name, date, email], (err, result) => {
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
const retrieveDOrder = (count: number, limit: number, email: string): Promise<[]> => {
    return new Promise<[]>((resolve, reject) => {
        const query = 'SELECT suya, gurasa, name, id FROM defined_orders WHERE email = ? ORDER BY created DESC LIMIT ? OFFSET ?';

        pool.query(query, [email, limit, limit * count], (err, result) => {
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


// query to delete order
const deleteDOrder = (id: number, email: string | undefined): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'DELETE FROM defined_orders WHERE id = ? AND email = ?';

        pool.query(query, [id, email], (err, result) => {
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



export { saveDOrder, retrieveDOrder, deleteDOrder };