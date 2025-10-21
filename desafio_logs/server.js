const http = require('http');
const fs = require('fs/promises');
require('dotenv').config();

const PORT = process.env.PORT || 3000
const AUTH_TOKEN = process.env.AUTH_TOKEN

const server = http.createServer((req, res) => {

    if (req.url === '/logs' && req.method === 'POST') {

        const tokenHeader = req.headers.authorization.split(' ')[1];

        if (tokenHeader !== AUTH_TOKEN) {
            res.writeHead(401, { "Content-type": "text/plain" })
            return res.end("Unauthorized: Invalid or missing token.")
        }

        let body = '';
        let date = new Date().toISOString().replace('T', ' ').split('.')[0];

        req.on('data', (chunk) => {
            body += chunk.toString();
        })

        req.on('end', async () => {
            try {
                const logData = body;
                console.log('logData', logData)

                const logMessage = `[${date}] - [${logData || 'No Message Provided'}]\n`;

                await fs.appendFile('./app.log', logMessage, 'utf-8');

                res.writeHead(201, { 'Content-Type': 'text/plain' })
                res.end('Arquivo de log criado com sucesso!')

            } catch (err) {
                console.log('error', err)
                res.writeHead(500, { "Content-type": "text/plain" })
                res.end("Internal Server Error")
            }
        })

    } else {
        res.writeHead(404, { "Content-type": "text/plain" })
        res.end("Not Found")
    }
})

server.listen(PORT, () => console.log(`Server running at port ${PORT}`))