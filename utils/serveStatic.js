import path from 'node:path'
import fs from 'node:fs/promises'
import { getContentType } from './getContentType'
import { sendResponse } from './sendResponse'

export async function serveStatic(req, res, baseDir) {
    const publicDir = path.join(baseDir, 'public')
    const filePath = path.join(
        publicDir, 
        req.url === '/'
        ? 'index.html'
        : req.url
    )

    const ext = path.extname(filePath)
    const contentType = getContentType(ext)

    try {

    } catch (err) {
        if (err.code === 'ENOENT') {
            const content = await fs.readFile(path.join(publicDir, '404.html'))
            sendResponse(res, 404, contentType, content)
        } else {
            sendResponse(res, 500, 'text/html', '<html><h1>Server Error: ${err.code}</h1></html>')
        }
    }
}