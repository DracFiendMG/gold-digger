import http from 'node:http';
import fs from 'node:fs/promises'
import path from 'node:path'
import { getContentType } from './utils/getContentType.js';
import { serveStatic } from './utils/serveStatic.js';

const PORT = 8000

const __dirname = import.meta.dirname
const publicDir = path.join(__dirname, 'public')

const server = http.createServer(async (req, res) => {

    if (req.url === '/favicon.ico') {
        res.statusCode = 204
        return res.end()
    }

    if (!req.url.startsWith('/api')) {
        serveStatic(req, res, publicDir)
    }
})

server.listen(PORT, () => {
    console.log(`Connected to server at ${PORT}`)
})