const { Pool } = require('pg');
require('dotenv').config();

const configDB = {
    user: `${process.env.POSTGRES_USER}`,
    database: `${process.env.POSTGRES_DB}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    host: `localhost`,
    port: `5433`,
}

const pool = new Pool(configDB);

async function transferirSaldo(idOrigem, idDestino, valor) {

    const client = await pool.connect();

    try {

        // 1. INICIA A TRANSAÇÃO
        await client.query('BEGIN');

        // 2. EXECUTAR QUERIES
        const checkBalance = await client.query('SELECT saldo FROM users WHERE id = $1', [idOrigem]);
        if (!checkBalance.rows.length) throw new Error(`Conta de origem (ID: ${idOrigem}) não encontrada.`);
        if (checkBalance.rows[0].saldo < valor) throw new Error(`Saldo insuficiente na conta de origem (ID: ${idOrigem}).`);

        await client.query('UPDATE users SET saldo = saldo - $1 WHERE id = $2', [valor, idOrigem]);

        await client.query('UPDATE users SET saldo = saldo + $1 WHERE id = $2', [valor, idDestino]);

        // 3. FINALIZA A TRANSAÇÃO
        await client.query('COMMIT');
        console.log(`✅ Transferência de R$${valor} de ID ${idOrigem} para ID ${idDestino} concluída com sucesso!`);

    } catch (error) {
        // SE HOUVER UM ERRO, DESFAZ TUDO
        await client.query('ROLLBACK');
        console.error('❌ ERRO na Transação. Operação desfeita:', error.message);
    } finally {
        // 4. DEVOLVE A CONEXÃO AO POOL
        client.release();
        console.log('🔗 Conexão liberada de volta para o Pool.');
    }
}

transferirSaldo(10, 7, 15);


