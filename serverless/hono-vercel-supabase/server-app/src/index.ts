import {Hono} from 'hono'
import https from 'https'

const app = new Hono()

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono',
  `Current runtime: ${process.release?.name || 'unknown'}`,
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

app.get('/test/https', async (c) => {
  try {
    const response = await new Promise<{statusCode: number, contentType: string, data: string}>((resolve, reject) => {
      https.get('https://httpbin.org/get', (res) => {
        const statusCode = res.statusCode || 0
        const contentType = res.headers['content-type'] || ''

        let responseData = ''
        res.on('data', (chunk) => {
          responseData += chunk.toString()
        })

        res.on('end', () => {
          resolve({ statusCode, contentType, data: responseData })
        })
      }).on('error', (err) => {
        reject(err)
      })
    })

    return c.json({
      success: true,
      statusCode: response.statusCode,
      contentType: response.contentType,
      data: JSON.parse(response.data)
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export default app
