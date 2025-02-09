import { query } from 'express';
import pool from '../modules/connectdb';
import { vAccountType } from '../types/general';


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

const saveVAcc = async (account_name: string, account_number: string, bank_name: string, email: string, tx_ref: string, balance: number = 0): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'INSERT INTO virtual_account (account_name, account_number, bank_name, email, tx_ref, balance) VALUES (?, ?, ?, ?, ?, ?)';

        pool.query(query, [account_name, account_number, bank_name, email, tx_ref, balance], (err, result) => {
            if (err) {
                console.error('An error occurred in creating user:', err);
                reject(err);
            } else {
                console.log(result, 'result.........')
                resolve(result.affectedRows > 0);
            };
        });
    });
};


const updateBalance = (newBalance: number, email: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const query = 'UPDATE virtual_account SET balance = ? WHERE email = ?';

        pool.query(query, [newBalance.toFixed(2), email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log(result, 'update balance', result.affectedRows);
                resolve(result.affectedRows > 0);
            }
        })
    })
}


export { getAcc, saveVAcc, updateBalance };