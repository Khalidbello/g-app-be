import { Express } from 'express';
import mysql, { Pool, MysqlError } from 'mysql';

const pool: Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME, // Specify your database name
});

function initiateConnection(app: Express, port: string | number) {
    pool.getConnection((err: MysqlError, connection) => {
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
};

export default pool;
export { initiateConnection }
