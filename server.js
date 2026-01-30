import http from 'node:http';
import fs from 'node:fs/promises'
import path from 'node:path'
import { getContentType } from './utils/getContentType.js';

const PORT = 8000

const __dirname = import.meta.dirname
const publicDir = path.join(__dirname, 'public')

const server = http.createServer(async (req, res) => {
    const filePath = path.join(publicDir,
        req.url === '/'
        ? 'index.html'
        : req.url
    )

    if (req.url === '/favicon.ico') {
        res.statusCode = 204
        return res.end()
    }

    const data = await fs.readFile(filePath)
    const ext = path.extname(filePath)
    res.statusCode = 200
    res.setHeader('Content-Type', getContentType(ext))
    res.end(data)
})

server.listen(PORT, () => {
    console.log(`Connected to server at ${PORT}`)
})