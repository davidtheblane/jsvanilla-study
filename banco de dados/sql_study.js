const { Client } = require('pg')
require('dotenv').config();

const configDB = {
    user: `${process.env.POSTGRES_USER}`,
    database: `${process.env.POSTGRES_DB}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    host: `localhost`,
    port: `5433`
}


async function createUserTable() {
    const client = new Client(configDB);
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            idade INT
        );
    `;

    try {
        await client.connect()
        console.log('✅ Conexão estabelecida com o PostgreSQL.');

        await client.query(createTableQuery);
        console.log('🎉 Tabela "usuarios" criada ou já existe com sucesso!');

    } catch (err) {
        console.error('❌ ERRO ao conectar ou criar a tabela:', err);
    } finally {
        await client.end();
        console.log('🔗 Conexão com o banco de dados fechada.');
    }
}

async function updateUserTable() {
    const client = new Client(configDB);
    const alterQuery = `
        ALTER TABLE usuarios 
        ADD COLUMN IF NOT EXISTS idade INT;
    `;

    try {
        await client.connect();
        await client.query(alterQuery);
        console.log('✅ Coluna "idade" adicionada (ou já existia) com sucesso!');
    } catch (err) {
        console.error('❌ ERRO ao adicionar coluna:', err.message);
    } finally {
        await client.end();
    }
}

async function insertUser(nome, idade) {
    const client = new Client(configDB);
    const createUserQuery = `INSERT INTO usuarios (nome, idade) values ($1, $2) RETURNING id`;
    const values = [nome, idade]

    try {

        await client.connect()

        // Executa a inserção segura
        const res = await client.query(createUserQuery, values)

        // O ID do novo usuário está em res.rows[0].id
        const novoUsuario = res.rows[0]

        console.log(`✅ Usuário inserido com sucesso! || ID: ${novoUsuario.id}`);

    } catch (err) {
        console.error('❌ ERRO ao inserir usuário:', err.message);
    } finally {
        await client.end();
    }
}

async function getUserByName(nome, idade) {
    const client = new Client(configDB);
    const query = `SELECT id, nome, idade FROM usuarios WHERE nome = $1 AND idade = $2`
    const values = [nome, idade]

    try {

        await client.connect()

        const res = await client.query(query, values);

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
    } finally {
        await client.end();
    }
}

async function updateUserName(id, novoNome) {
    const client = new Client(configDB);
    const query = `UPDATE usuarios SET nome = $2 WHERE id = $1`
    const values = [id, novoNome]

    try {

        await client.connect()

        const res = await client.query(query, values);

        if (res.rowCount >= 1) {
            console.log(`✅ Usuário ID ${id} atualizado para ${novoNome} com sucesso!`);
        } else {
            console.log(`⚠️ Nenhum usuário encontrado com o id: ${id}`);
            return [];
        }

    } catch (err) {
        console.error('❌ ERRO ao buscar usuário:', err.message);
    } finally {
        await client.end();
    }
}

createUserTable();

// insertUser("Higor", 32);

// getUserByName("Higor", 32)
// updateUserName(15, 'Henrique')
// updateUserTable()