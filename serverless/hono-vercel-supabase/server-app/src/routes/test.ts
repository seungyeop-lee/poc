import {Hono} from 'hono'
import https from 'https'
import {mtlsGet} from '../utils/mtls.js'

const router = new Hono()

router.get('/https', async (c) => {
  const response = await new Promise<{
    statusCode: number,
    contentType: string,
    data: string
  }>((resolve, reject) => {
    const req = https.get('https://httpbin.org/get', (res) => {
      let responseData = ''
      res.on('data', (chunk) => {
        responseData += chunk.toString()
      })

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 0,
          contentType: res.headers['content-type'] || '',
          data: responseData
        })
      })
    })

    req.on('error', (err) => {
      reject(err)
    })
    req.end()
  })

  return c.json({
    success: true,
    statusCode: response.statusCode,
    contentType: response.contentType,
    data: JSON.parse(response.data)
  })
})

router.get('/mtls', async (c) => {
  const response = await mtlsGet('https://localhost:3001')

  return c.json({
    success: true,
    statusCode: response.statusCode,
    contentType: response.contentType,
    data: response.data
  })
})

export default router
