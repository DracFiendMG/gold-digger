import PDFDocument from 'pdfkit'
import fs from 'node:fs'

export function generatePDF(data, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const writeStream = fs.createWriteStream(outputPath)

    doc.pipe(writeStream)

    doc.fontSize(20).font('Helvetica-Bold').text('Gold Investment Report', { align: 'center' })
    doc.moveDown(2)

    const tableTop = 120
    const columnWidths = {
      timestamp: 180,
      investmentAmount: 100,
      currentPrice: 100,
      goldPurchased: 100
    }
    const headers = ['Timestamp', 'Investment (£)', 'Price Per oz (£)', 'Gold (oz)']
    const keys = ['timestamp', 'investmentAmount', 'currentPrice', 'goldPurchased']
    
    let startX = 50
    const rowHeight = 25

    doc.fontSize(10).font('Helvetica-Bold')
    doc.rect(startX, tableTop, 480, rowHeight).fill('#333333')
    doc.fillColor('white')
    
    let xPos = startX + 5
    headers.forEach((header, i) => {
      doc.text(header, xPos, tableTop + 8, { width: columnWidths[keys[i]] - 10 })
      xPos += columnWidths[keys[i]]
    })

    doc.font('Helvetica').fillColor('black')
    let yPos = tableTop + rowHeight

    data.forEach((row, index) => {
      if (index % 2 === 0) {
        doc.rect(startX, yPos, 480, rowHeight).fill('#f5f5f5')
      } else {
        doc.rect(startX, yPos, 480, rowHeight).fill('#ffffff')
      }
      
      doc.fillColor('black')
      xPos = startX + 5

      keys.forEach((key) => {
        let value = row[key]
        if (key === 'timestamp') {
          value = new Date(value).toLocaleString()
        }
        if (key === 'currentPrice' || key === 'investmentAmount') {
          value = parseFloat(value).toFixed(2)
        }
        doc.text(String(value), xPos, yPos + 8, { width: columnWidths[key] - 10 })
        xPos += columnWidths[key]
      })

      yPos += rowHeight
    })

    doc.rect(startX, tableTop, 480, rowHeight + (data.length * rowHeight)).stroke('#cccccc')

    doc.end()

    writeStream.on('finish', () => {
      console.log(`PDF generated at: ${outputPath}`)
      resolve(outputPath)
    })

    writeStream.on('error', reject)
  })
}