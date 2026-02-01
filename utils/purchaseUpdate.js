import fs from 'node:fs/promises'
import path from 'node:path'

export async function purchaseUpdate(payload) {
    console.log(payload)
    const filePath = path.join('data', 'data.txt')
    await fs.writeFile(
        filePath,
        JSON.stringify(payload)
    )
}