require('dotenv').config();

const { Pool } = require('pg');

try {
    const pool = new Pool({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    });

    module.exports = pool;
} catch (error) {
    console.error('Error creating PostgreSQL pool:', error);
}