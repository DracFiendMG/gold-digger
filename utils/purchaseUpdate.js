import fs from 'node:fs/promises'
import path from 'node:path'

const filePath = path.join('data', 'data.json')

export async function purchaseUpdate(payload) {
    console.log(payload)

    let existingData = await fs.readFile(filePath, 'utf-8')
    let parsedExistingData = existingData ? JSON.parse(existingData) : []

    parsedExistingData.push(payload)
    await fs.writeFile(
        filePath,
        JSON.stringify(parsedExistingData, null, 2)
    )

    console.log('Purchase data updated successfully.')
}