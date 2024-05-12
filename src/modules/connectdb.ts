import { Express } from 'express';
import mysql, { Pool, MysqlError } from 'mysql';

const pool: Pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'kH9L!DJ9EG9R!ST',
    database: 'gapp', // Specify your database name
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
