import fs from 'node:fs'
import path from 'node:path'
import { purchaseEvents } from "../events/purchaseEvents.js"
import { parseJSONBody } from "../utils/parseJSONBody.js"
import { sendResponse } from "../utils/sendResponse.js"
import { generatePDF } from "../utils/generatePDF.js"

export function handleLive(req, res) {
    let goldPrice = 2000.00
    res.statusCode = 200

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    res.write(`data: ${JSON.stringify({ event: 'live-price', price: goldPrice.toFixed(2) })}\n\n`)

    const intervalId = setInterval(() => {
        let randomInt = (Math.random() * 5) - 1
        goldPrice += randomInt
        
        res.write(
            `data: ${JSON.stringify({ event: 'live-price', price: goldPrice.toFixed(2) })}\n\n`
        )
    }, 3000)

    req.on('close', () => {
        clearInterval(intervalId)
        console.log('SSE client disconnected, cleaned up interval')
    })
}

export async function handlePost(req, res) {
    const body = await parseJSONBody(req)
    purchaseEvents.emit('purchase-event', body)
    sendResponse(res, 200, 'application/json', JSON.stringify({ message: 'Investment received!' }))
}

export async function handleGeneratePDF(req, res, baseDir) {
    try {
        const dataPath = path.join(baseDir, 'data', 'data.json')
        const jsonData = fs.readFileSync(dataPath, 'utf-8')
        const data = JSON.parse(jsonData)

        const outputPath = path.join(baseDir, 'data', 'report.pdf')
        await generatePDF(data, outputPath)

        const pdfBuffer = fs.readFileSync(outputPath)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename="gold-investment-report.pdf"')
        res.statusCode = 200
        res.end(pdfBuffer)
    } catch (error) {
        console.error('Error generating PDF:', error)
        sendResponse(res, 500, 'application/json', JSON.stringify({ error: 'Failed to generate PDF' }))
    }
}