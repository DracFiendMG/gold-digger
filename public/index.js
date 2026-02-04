const eventSource = new EventSource('/api/live-price')

const bodyEl = document.querySelector('body')
const investFormEl = document.getElementById('invest-form')
const priceDisplay = document.getElementById('price-display')
const investBtnEl = document.getElementById('invest-btn')
const investmentAmountEl = document.getElementById('investment-amount')
const dialogEl = document.querySelector('dialog')
const purchasedOuncesEl = document.getElementById('purchased-ounces')
const investedAmountEl = document.getElementById('invested-amount')

document.getElementById('ok-btn').addEventListener('click', () => {
    dialogEl.classList.remove('display-dialog')
    bodyEl.style.pointerEvents = 'auto'
})

document.getElementById('download-pdf-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('./api/generate-pdf')
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'gold-investment-report.pdf'
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
    } catch (err) {
        console.error('Error downloading PDF:', err)
    }
})

investFormEl.addEventListener('submit', async (e) => {
    e.preventDefault()

    const investForm = new FormData(investFormEl)

    const email = investForm.get('email')
    const investmentAmount = investForm.get('investment-amount')

    const currentPrice = Number(priceDisplay.textContent)
    const goldPurchased = (investmentAmount/currentPrice).toFixed(4)

    purchasedOuncesEl.textContent = goldPurchased
    investedAmountEl.textContent = investmentAmount
    dialogEl.classList.add('display-dialog')
    bodyEl.style.pointerEvents = 'none'

    const payload = {
        timestamp: new Date(),
        investmentAmount,
        currentPrice,
        goldPurchased
    }

    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'email': email
            },
            body: JSON.stringify(payload)
        }
        const response = await fetch('./api/invest', options)
        const data = await response.json()
    } catch (err) {
        console.error('Error:', err)
    }
})

eventSource.onmessage = (event) => {
    console.log('Connected')
    const data = JSON.parse(event.data)
    priceDisplay.textContent = data.price
}

eventSource.onerror = () => {
    console.log('Connection lost! Attempting to reconnect...')
}

