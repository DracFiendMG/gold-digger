import EventEmitter from 'node:events'
import { priceUpdate } from '../utils/livePriceUpdate'

export const livePriceEvents = new EventEmitter()

livePriceEvents.on('live-price', priceUpdate)