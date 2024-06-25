"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateConnection = void 0;
const mysql_1 = __importDefault(require("mysql"));
const pool = mysql_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME, // Specify your database name
});
function initiateConnection(app, port) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.stack);
            process.exit(1); // Exit the application if unable to connect to MySQL
        }
        console.log('Connected to MySQL as ID ' + connection.threadId);
        connection.release(); // Release the connection back to the pool
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    });
}
exports.initiateConnection = initiateConnection;
;
exports.default = pool;
//# sourceMappingURL=connectdb.js.map