import { query } from 'express';
import pool from '../modules/connectdb';
import { vAccountType } from './../types/v-account-types';


const getAcc = async (email: string | undefined): Promise<vAccountType> => {
    return new Promise<vAccountType>((resolve, reject) => {
        const query = 'SELECT account_number, account_name, bank_name, balance FROM virtual_account WHERE email = ?';
        pool.query(query, [email], (err, results) => {
            if (err) {
                reject(err);
            } else {
                console.log(results);
                resolve(results[0]);
            }
        })
    })
};

export { getAcc };