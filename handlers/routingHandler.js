import { purchaseEvents } from "../events/purchaseEvents.js"
import { parseJSONBody } from "../utils/parseJSONBody.js"
import { sendResponse } from "../utils/sendResponse.js"

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