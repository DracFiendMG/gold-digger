import { SMTPClient, Message } from 'emailjs'

const username = process.env.EMAIL_USERNAME

const client = new SMTPClient({
    user: username,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: 465,
    ssl: true
})

export async function sendEmail(to, body) {
    console.log(`Preparing to send email to ${to} with body:`, body)
    const htmlContent = `
        <h1>Thanks for investing in gold!</h1>
    `

    const message = new Message({
        from: username,
        to: to,
        subject: 'Your gold investment was successful!',
        attachment: [
            {
                data: htmlContent,
                alternative: true,
                contentType: 'text/html'
            }
        ]
    })

    try {
        await client.sendAsync(message)
        console.log('Email sent successfully!')
    } catch (err) {
        console.error(`Failed to send rich email: ${err}`)
    } finally {
        if (client.smtp) {
            client.smtp.close()
        }
    }
}