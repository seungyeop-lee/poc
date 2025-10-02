import { Client } from 'undici'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function testMtlsConnection(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const tls = {
      ca: process.env.CA_CERT || fs.readFileSync(path.join(__dirname, '../../certs/ca/ca.crt'), 'utf8'),
      cert: process.env.CLIENT_CERT || fs.readFileSync(path.join(__dirname, '../../certs/client/client.crt'), 'utf8'),
      key: process.env.CLIENT_KEY || fs.readFileSync(path.join(__dirname, '../../certs/client/client.key'), 'utf8'),
    }

    const serverUrl = process.env.MTLS_SERVER_URL || 'https://localhost:8443'
    const client = new Client(serverUrl, {
      connect: {
        ...tls,
        servername: 'localhost', // Force servername to match certificate CN
        rejectUnauthorized: true
      }
    })

    const { statusCode, body } = await client.request({
      path: '/secure',
      method: 'GET'
    })

    const responseText = await body.text()
    const data = JSON.parse(responseText)

    return {
      success: statusCode === 200,
      data: {
        statusCode,
        ...data
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}
