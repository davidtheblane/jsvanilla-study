const fp = require('fastify-plugin');
const { Pool } = require('pg');
require('dotenv').config();

async function dbConnector(fastify, options) {
    const pool = new Pool({
        user: `${process.env.POSTGRES_USER}`,
        database: `${process.env.POSTGRES_DB}`,
        password: `${process.env.POSTGRES_PASSWORD}`,
        host: `localhost`,
        port: `5433`,
    });

    try {
        await pool.query('SELECT NOW()')
        fastify.log.info('Conexão com PostgreSQL estabelecida com sucesso!');

        //     await pool.query(`
        //         CREATE TABLE IF NOT EXISTS users (
        //         id SERIAL PRIMARY KEY,
        //         nome VARCHAR(100) NOT NULL,
        //         idade INT,
        //         saldo NUMERIC DEFAULT 0
        //     );
        // `)

        fastify.decorate('db', pool);

    } catch (error) {
        fastify.log.error('Erro ao conectar ao banco de dados:', error.message);
        throw error;
    }
}

module.exports = fp(dbConnector)