const eventSource = new EventSource('/api/live-price')

const priceDisplay = document.getElementById('price-display')
const investBtnEl = document.getElementById('invest-btn')
const investmentAmount = document.getElementById('investment-amount')
const dialogEl = document.querySelector('dialog')
const purchasedOuncesEl = document.getElementById('purchased-ounces')
const investedAmountEl = document.getElementById('invested-amount')

document.getElementById('ok-btn').addEventListener('click', () => {
    dialogEl.classList.remove('display-dialog')
})

document.getElementById('invest-form').addEventListener('submit', async (e) => {
    e.preventDefault()

    const currentPrice = Number(priceDisplay.textContent)
    const goldPurchased = (investmentAmount.value/currentPrice).toFixed(2)

    purchasedOuncesEl.textContent = goldPurchased
    investedAmountEl.textContent = investmentAmount.value
    dialogEl.classList.add('display-dialog')

    try {
        const response = await fetch('./api')
    } catch (err) {

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

