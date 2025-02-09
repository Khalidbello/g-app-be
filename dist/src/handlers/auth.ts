import { Request, Response } from 'express';
import { checkUserExist, createNewUser } from '../services/users/users-queries';
import { CustomSessionData } from './../types/session-types';


// function to handle user login
const logInHandler = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const response = await checkUserExist(email);

        console.log('response .......', response)
        if (response && response.password === password) {
            (req.session as CustomSessionData).user = {
                email: email,
                type: 'normal',
                id: response.id
            }
            return res.status(200).json({ message: 'logged in succesfully' });
        };
        res.status(404).json({ message: 'user with cridentials not found' });
    } catch (err) {
        res.status(500).json({ message: err });
    };
};



// function to handle creating of new accont 
const createAccountHandler = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, gender } = req.body;

    try {
        const response = await checkUserExist(email);

        if (response) {
            return res.status(409).json({ message: 'user exist' });
        };

        const created = await createNewUser(firstName, lastName, email, password, gender);

        if (created.affectedRows === 1) {
            (req.session as CustomSessionData).user = {
                email: email,
                type: 'normal',
                id: created.insertId
            };
            return res.json({ message: 'account created successfully' });
        };

        throw 'unable to create new user';
    } catch (err) {
        res.status(500).json({ message: 'An error occured trying to create acount' });
    };
};

export { logInHandler, createAccountHandler };