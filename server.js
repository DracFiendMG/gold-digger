import http from 'node:http';
import fs from 'node:fs/promises'
import path from 'node:path'
import { getContentType } from './utils/getContentType.js';

const PORT = 8000

const __dirname = import.meta.dirname

const server = http.createServer(async (req, res) => {
    const filePath = path.join(__dirname, 'public',
        req.url === '/'
        ? 'index.html'
        : req.url
    )

    const data = await fs.readFile(filePath)
    const ext = path.extname(filePath)
    res.statusCode = 200
    res.setHeader('Content-Type', getContentType(ext))
    res.end(data)
})

server.listen(PORT, () => {
    console.log(`Connected to server at ${PORT}`)
})