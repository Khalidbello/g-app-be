"use strict";
//ngrok http --domain=weekly-settled-falcon.ngrok-free.app 5000
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const users_1 = __importDefault(require("./routes/users"));
const gateway_1 = __importDefault(require("./routes/gateway"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connectdb_1 = require("./modules/connectdb");
// Create an Express application
const app = (0, express_1.default)();
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
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(corsOptions));
app.use((0, express_session_1.default)(sessionOptions));
// static middleware
app.use(express_1.default.static('public'));
// locking in separete routes as middlewares
app.use('/auth', auth_1.default);
app.use('/admin', admin_1.default);
app.use('/users', users_1.default);
app.use('/gateway', gateway_1.default);
// Define a route handler for the root path
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// route to handle errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});
// connect to db 
(0, connectdb_1.initiateConnection)(app, port);
//# sourceMappingURL=index.js.map