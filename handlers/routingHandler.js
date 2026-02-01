export function handleLive(req, res) {
    let goldPrice = 2000.00
    res.statusCode = 200

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    setInterval(() => {
        let randomInt = (Math.random() * 5) - 1
        goldPrice += randomInt
        
        res.write(
            `data: ${JSON.stringify({ event: 'live-price', price: goldPrice.toFixed(2) })}\n\n`
        )
    }, 3000)
}