// const fs = require('fs');
const http = require('node:http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Hello World!')
    } else if (req.url === '/sobre') {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('Sobre Nos!')
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not Found!')
    }
})

server.listen(3000, () => {
    console.log('Server Running on port 3000!')
})