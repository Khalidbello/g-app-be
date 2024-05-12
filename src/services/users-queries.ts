import pool from '../modules/connectdb';


// function to check if user exists
const checkUserExist = async (email: string): Promise<[{ password: string }]> => {
    return new Promise<[{ password: string }]>((resolve, reject) => {
        // Use parameterized query to prevent SQL injection
        const query = 'SELECT password FROM users WHERE email = ?';

        pool.query(query, [email], (err, result) => {
            if (err) {
                console.error('An error occurred in checkUserExist:', err);
                reject(err); // Reject the promise with the error
            } else {
                resolve(result); // Resolve the promise with the boolean result
            }
        });
    });
};


// function to create new user
const createNewUser = async (firstName: string, lastName: string, email: string, password: string, gender: 'male' | 'female',): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO users (first_name, last_name, email, password, gender) VALUES (?, ?, ?, ?, ?)';

        pool.query(query, [firstName, lastName, email, password, gender], (err, result) => {
            if (err) {
                console.log('an eror occured in create User', err);
                reject(err);
            } else {
                console.log(result, 'result.........')
                resolve(result.affectedRows === 1);
            }
        })
    });
};


export { checkUserExist, createNewUser }