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
    if (!to) {
        console.error('Email recipient (to) is undefined. Email not sent.')
        return
    }

    if (!username) {
        console.error('EMAIL_USERNAME environment variable is not set. Email not sent.')
        return
    }

    console.log(`Preparing to send email to ${to} with body:`, body)
    
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GoldDigger Investment Confirmation</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto:wght@400;700&family=Saira+Stencil+One&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Roboto', Arial, sans-serif;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background: linear-gradient(180deg, #2b2724 60%, darkgoldenrod); border-radius: 10px; padding: 40px 30px;">
                            <!-- Header -->
                            <tr>
                                <td align="center" style="padding-bottom: 20px;">
                                    <h1 style="margin: 0; font-family: 'Saira Stencil One', serif; font-size: 2.5em; color: gold; letter-spacing: 1.3px; background: linear-gradient(45deg, gold, darkgoldenrod); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                                        GoldDigger
                                    </h1>
                                </td>
                            </tr>
                            
                            <!-- Gold Image Placeholder -->
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <div style="width: 100px; height: 100px; background-color: darkgoldenrod; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                                        <span style="font-size: 50px;">🏆</span>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Success Message -->
                            <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <h2 style="margin: 0; color: gold; font-size: 1.8em; font-weight: 700;">
                                        Investment Successful!
                                    </h2>
                                </td>
                            </tr>
                            
                            <!-- Investment Details Box -->
                            <tr>
                                <td style="padding: 20px 0;">
                                    <table role="presentation" style="width: 100%; border: 2px solid gold; border-radius: 10px; padding: 20px; background-color: rgba(0,0,0,0.2);">
                                        <tr>
                                            <td align="center">
                                                <p style="margin: 0 0 15px 0; color: gold; font-size: 1.1em; line-height: 1.6;">
                                                    Thank you for investing in gold with GoldDigger!
                                                </p>
                                                <p style="margin: 15px 0; color: gold; font-size: 1.2em; font-weight: 600;">
                                                    Investment Amount: <span style="color: darkgoldenrod; font-size: 1.3em;">£${body?.investmentAmount || 'N/A'}</span>
                                                </p>
                                                <p style="margin: 15px 0; color: gold; font-size: 1.2em; font-weight: 600;">
                                                    Gold Purchased: <span style="color: darkgoldenrod; font-size: 1.3em;">${body?.goldPurchased || 'N/A'} oz</span>
                                                </p>
                                                <p style="margin: 15px 0 0 0; color: gold; font-size: 0.9em; font-style: italic;">
                                                    Price per ounce: £${body?.currentPrice || 'N/A'}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Message -->
                            <tr>
                                <td style="padding: 20px 0;">
                                    <p style="margin: 0; color: gold; font-size: 1em; line-height: 1.6; text-align: center;">
                                        Your investment documentation has been prepared and is ready for download. 
                                        You can access your investment report from your GoldDigger dashboard.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer Note -->
                            <tr>
                                <td style="padding-top: 30px; border-top: 1px solid darkgoldenrod;">
                                    <p style="margin: 10px 0 0 0; color: gold; font-size: 0.85em; text-align: center; font-style: italic;">
                                        * 1oz = 1 troy ounce of 24 Carat Gold
                                    </p>
                                    <p style="margin: 10px 0 0 0; color: darkgoldenrod; font-size: 0.8em; text-align: center;">
                                        This is an automated message. Please do not reply to this email.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
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