import EventEmitter from 'node:events'
import { purchaseUpdate } from '../utils/purchaseUpdate.js'

export const purchaseEvents = new EventEmitter()

purchaseEvents.on('purchase-event', purchaseUpdate)