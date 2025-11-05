import mysql, { PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const poolOptions: PoolOptions = {
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '3306'),
    user: process.env['DB_USER'] || 'root',
    password: process.env['DB_PASSWORD'] || '',
    database: process.env['DB_NAME'] || 'voter_registration',
    connectionLimit: 10,
    queueLimit: 0,
    waitForConnections: true,
    idleTimeout: 60000,
};

const pool = mysql.createPool(poolOptions);

export default pool;