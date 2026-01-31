import http from 'node:http';
import path from 'node:path'
import { serveStatic } from './utils/serveStatic.js';
import { handleLive } from './handlers/routingHandler.js';

const PORT = 8000

const __dirname = import.meta.dirname
const publicDir = path.join(__dirname, 'public')

const server = http.createServer(async (req, res) => {
    console.log(req.url)

    if (req.url === '/favicon.ico') {
        res.statusCode = 204
        return res.end()
    }

    if (req.url.startsWith('/api/live-price') && req.method === 'GET') {
        handleLive(req, res)
    } else if (!req.url.startsWith('/api')) {
        serveStatic(req, res, publicDir)
    }
})

server.listen(PORT, () => {
    console.log(`Connected to server at ${PORT}`)
})