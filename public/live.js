const eventSource = new EventSource('/api/live-price')

const priceDisplay = document.getElementById('price-display')

eventSource.onmessage = (event) => {
    console.log('Connected')
    const data = JSON.parse(event.data)
    console.log(data)
}

eventSource.onerror = () => {
    console.log('Connection lost! Attempting to reconnect...')
}

