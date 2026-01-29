import http from 'node:http';
import fs from 'node:fs/promises'
import path from 'node:path'

const PORT = 8000

const __dirname = import.meta.dirname
const baseDir = path.join(__dirname, 'public')

const server = http.createServer(async (req, res) => {
    if (req.url === '/api') {
        const filePath = path.join(baseDir, 'index.html')
        const data = await fs.readFile(filePath)

        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        res.end(data)
    }
    res.end('Success')
})

server.listen(PORT, () => {
    console.log(`Connected to server at ${PORT}`)
})