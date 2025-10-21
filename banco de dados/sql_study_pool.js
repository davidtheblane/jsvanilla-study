const { Pool } = require('pg')
require('dotenv').config();

const configDB = {
    user: `${process.env.POSTGRES_USER}`,
    database: `${process.env.POSTGRES_DB}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    host: `localhost`,
    port: `5433`,
}

const pool = new Pool(configDB);

async function createUserTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
        );
    `;

    try {
        await pool.query(createTableQuery);
        console.log('🎉 Tabela "users" criada ou já existe com sucesso!');

    } catch (err) {
        console.error('❌ ERRO ao conectar ou criar a tabela:', err);
    }
}

async function updateUserTable() {
    const alterQuery = `
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS idade INT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS saldo NUMERIC DEFAULT 0;
        `;

    try {
        await pool.query(alterQuery);
        console.log('✅ Tabela alterada com sucesso!');
    } catch (err) {
        console.error('❌ ERRO ao adicionar coluna:', err.message);
    }
}

async function insertUser(nome, idade, saldo) {
    const createUserQuery = `INSERT INTO users (nome, idade, saldo) values ($1, $2, $3) RETURNING id`;
    const values = [nome, idade, saldo || 0];

    try {

        // Executa a inserção segura
        const res = await pool.query(createUserQuery, values)

        // O ID do novo usuário está em res.rows[0].id
        const novoUsuario = res.rows[0]

        console.log(`✅ Usuário inserido com sucesso! || ID: ${novoUsuario.id}`);

    } catch (err) {
        console.error('❌ ERRO ao inserir usuário:', err.message);
    }
}

async function getUserByName(nome, idade) {
    const query = `SELECT id, nome, idade FROM users WHERE nome = $1 AND idade = $2`
    const values = [nome, idade]

    try {
        const res = await pool.query(query, values);

        if (res.rows.length > 0) {
            console.log('🎉 Usuário(s) encontrado(s):');
            res.rows.forEach(user => {
                console.log(`- ID: ${user.id}, Nome: ${user.nome}`);
            });
            return res.rows;
        } else {
            console.log(`⚠️ Nenhum usuário encontrado com o nome: ${nome}`);
            return [];
        }

    } catch (err) {
        console.error('❌ ERRO ao buscar usuário:', err.message);
    }
}

async function updateUserName(id, novoNome) {
    const query = `UPDATE users SET nome = $2 WHERE id = $1`
    const values = [id, novoNome]

    try {
        const res = await pool.query(query, values);

        if (res.rowCount >= 1) {
            console.log(`✅ Usuário ID ${id} atualizado para ${novoNome} com sucesso!`);
        } else {
            console.log(`⚠️ Nenhum usuário encontrado com o id: ${id}`);
            return [];
        }

    } catch (err) {
        console.error('❌ ERRO ao atualizar usuário:', err.message);
    }
}

async function deleteUser(id) {
    const query = `DELETE FROM users WHERE id = $1`
    const values = [id]

    try {
        const res = await pool.query(query, values);

        if (res.rowCount >= 1) {
            console.log(`✅ Usuário ID ${id} excluído com sucesso!`);
        } else {
            console.log(`⚠️ Nenhum usuário encontrado com o id: ${id}`);
            return [];
        }

    } catch (err) {
        console.error('❌ ERRO ao excluir usuário:', err.message);
    }
}

// createUserTable();

insertUser("Gabriela", 22, 100);
insertUser("Maria", 22, 100);

// getUserByName("Fernando", 18);
// updateUserName(4, 'Robson');
// deleteUser(5);

// updateUserTable();