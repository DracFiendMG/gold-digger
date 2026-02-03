import EventEmitter from 'node:events'
import { sendEmail } from '../utils/sendEmail.js'

export const emailEvents = new EventEmitter()

emailEvents.on('send-email', sendEmail)