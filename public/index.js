const eventSource = new EventSource('/api/live-price')

const priceDisplay = document.getElementById('price-display')
const investBtnEl = document.getElementById('invest-btn')
const investmentAmountEl = document.getElementById('investment-amount')
const dialogEl = document.querySelector('dialog')
const purchasedOuncesEl = document.getElementById('purchased-ounces')
const investedAmountEl = document.getElementById('invested-amount')

document.getElementById('ok-btn').addEventListener('click', () => {
    dialogEl.classList.remove('display-dialog')
})

document.getElementById('invest-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const currentPrice = Number(priceDisplay.textContent)
    const investmentAmount = investmentAmountEl.value
    const goldPurchased = (investmentAmount/currentPrice).toFixed(2)

    purchasedOuncesEl.textContent = goldPurchased
    investedAmountEl.textContent = investmentAmount
    dialogEl.classList.add('display-dialog')

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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }
        const response = await fetch('./api/invest', options)
        const data = await response.json()
        console.log(data)
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

