const fastify = require('fastify')({ logger: true });
const dbPlugin = require('./db-plugin');

fastify.register(dbPlugin);

const userSchema = {
    type: 'object',
    required: ['nome', 'idade', 'saldo'],
    properties: {
        nome: { type: 'string' },
        idade: { type: 'integer' },
        saldo: { type: 'number' }
    }
};

fastify.get('/', async (request, reply) => {
    return { hello: 'World' };
});

// ====================================================================
// 3. ROTA POST /users - CRIAR USUÁRIO
// ====================================================================

fastify.post('/users', {
    schema: { body: userSchema }
}, async (request, reply) => {

    const { nome, idade, saldo } = request.body;
    const insertQuery = 'INSERT INTO users (nome, idade, saldo) VALUES ($1, $2, $3) RETURNING id';
    const values = [nome, idade, saldo]

    try {
        const res = await fastify.db.query(insertQuery, values);

        reply.code(201);
        return {
            id: res.rows[0].id,
            nome,
            message: 'Usuário criado com sucesso!'
        };

    } catch (error) {
        fastify.log.error('Erro no INSERT:', error.message);
        reply.code(500);
        return { error: 'Falha ao criar usuário.' };
    }
})

// ====================================================================
// 4. ROTA GET /users/:id - BUSCAR USUÁRIO
// ====================================================================

fastify.get('/users/:id', async (request, reply) => {

    const userId = request.params.id;
    const insertQuery = 'SELECT id, nome, idade, saldo FROM users WHERE id = $1';
    const values = [userId];

    try {
        const res = await fastify.db.query(insertQuery, values);

        if (res.rows.length === 0) {
            reply.code(404);
            return { message: 'Usuário não encontrado.' };
        }

        return res.rows[0];

    } catch (error) {
        fastify.log.error('Erro no SELECT:', error.message);
        reply.code(500);
        return { error: 'Falha ao buscar usuário.' };
    }
})

// ====================================================================
// 5. ROTA DELETE /users/:id - EXCLUIR USUÁRIO
// ====================================================================

fastify.delete('/users/:id', async (request, reply) => {
    const userId = request.params.id;
    const insertQuery = 'DELETE FROM users WHERE id=$1';
    const values = [userId]

    try {
        const res = await fastify.db.query(insertQuery, values);

        if (res.rowCount === 0) {
            // Retorno 404 Not Found
            reply.code(404);
            return { message: 'Usuário não encontrado para exclusão.' };
        }

        reply.code(204);
        return {};

    } catch (error) {
        fastify.log.error('Erro no DELETE:', error.message);
        reply.code(500);
        return { error: 'Falha ao excluir usuário.' };
    }
})

// ====================================================================
// 6. ROTA GET /users - LISTAR E FILTRAR USUÁRIOS
// ====================================================================

fastify.get('/users', async (request, reply) => {
    const nomeFiltro = request.query.name;
    console.log('contrato', request.query)

    let insertQuery = 'SELECT * FROM users'
    const values = []

    try {

        if (nomeFiltro) {
            insertQuery += ' WHERE nome ILIKE $1' // ILIKE para busca case-insensitive
            values.push(`%${nomeFiltro}%`); // Adiciona '%' (wildcard) para buscar nomes que contenham o filtro
        }
        console.log({ insertQuery })

        const res = await fastify.db.query(insertQuery, values);

        if (res.rows.length === 0) {
            reply.code(200);
            return {
                message: 'Nenhum usuário encontrado.',
                users: []
            };
        }

        return { total: res.rows.length, users: res.rows }

    } catch (error) {
        fastify.log.error('ERRO no SELECT:', error.message);
        reply.code(500)
        return { error: 'Falha ao listar usuários.' }
    }

})

const start = async () => {
    const port = process.env.PORT || 3000;
    try {
        await fastify.listen({ port: port });
        fastify.log.info(`Servidor Fastify rodando na porta ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();