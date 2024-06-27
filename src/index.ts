//ngrok http --domain=weekly-settled-falcon.ngrok-free.app 5000

import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction, } from 'express';
import auth from './routes/auth';
import admin from './routes/admin';
import users from './routes/users';
import paymentGateWay from './routes/gateway'
import cors from 'cors';
import session from 'express-session';
import { initiateConnection } from './modules/connectdb';


// Create an Express application
const app = express();
const port = process.env.PORT || 8000;



// environment configurations
if (process.env.NODE_ENV === 'development') {
    process.env.FLW_PB_KEY = process.env.FLW_TEST_PB_KEY;
    process.env.FLW_SCRT_KEY = process.env.FLW_TEST_SCRT_KEY;
    process.env.FLW_H = process.env.FLW_H_TEST;
}


//locking in middlewares
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your allowed origin
    credentials: true, // Enable credentials (cookies, authorization headers)
};

const sessionOptions = {
    secret: 'your-secret-key', // Replace with your secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production if using HTTPS
        httpOnly: true, // Ensures cookies are only accessible via HTTP(S) and not client-side scripts
        maxAge: 0.5 * 60 * 60 * 1000, // Session expiration time in milliseconds (e.g., 1 day)
    },
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(session(sessionOptions));

// static middleware
app.use(express.static('public'));


// locking in separete routes as middlewares

app.use('/auth', auth);
app.use('/admin', admin);
app.use('/users', users);
app.use('/gateway', paymentGateWay);

// Define a route handler for the root path
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});



// route to handle errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

// connect to db 
initiateConnection(app, port)