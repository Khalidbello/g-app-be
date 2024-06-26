import pool from '../../modules/connectdb';
import { checkUserExistType } from '../../types/general';


// function to check if user exists
const checkUserExist = async (email: string | undefined): Promise<checkUserExistType> => {
    return new Promise<checkUserExistType>((resolve, reject) => {
        // Use parameterized query to prevent SQL injection
        const query = 'SELECT id, password, first_name, last_name, gender  FROM users WHERE email = ?';

        pool.query(query, [email], (err, result) => {
            if (err) {
                console.error('An error occurred in checkUserExist:', err);
                reject(err); // Reject the promise with the error
            } else {
                resolve(result[0]); // Resolve the promise with the boolean result
            }
        });
    });
};


// function to create new user
const createNewUser = async (firstName: string, lastName: string, email: string, password: string, gender: 'male' | 'female',): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        const query = 'INSERT INTO users (first_name, last_name, email, password, gender) VALUES (?, ?, ?, ?, ?)';

        pool.query(query, [firstName, lastName, email, password, gender], (err, result) => {
            if (err) {
                console.log('an eror occured in create User', err);
                reject(err);
            } else {
                console.log(result, 'result.........')
                resolve(result);
            }
        })
    });
};


export { checkUserExist, createNewUser }