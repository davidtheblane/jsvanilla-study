const http = require('http');
const fs = require('fs')
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        let output = '';
        const input = fs.createReadStream('./config.json')

        input.on('data', (chunk) => {
            output += chunk.toString();
        });

        input.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(output)
        })

        input.on('error', (err) => {
            console.error('Erro no Stream', err);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Arquivo de configuração não encontrado!')
        })
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found')
    }
});

server.listen(PORT, () => {
    console.log(`Server listen at port ${PORT}`);
})