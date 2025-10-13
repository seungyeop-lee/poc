import {Hono} from 'hono'
import https from 'https'

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
  const response = await new Promise<{
    statusCode: number,
    contentType: string,
    data: string
  }>((resolve, reject) => {
    const options: https.RequestOptions = {
      cert: Buffer.from(process.env.CLIENT_CERT!, 'base64').toString('utf-8'),
      key: Buffer.from(process.env.CLIENT_KEY!, 'base64').toString('utf-8'),
      ca: Buffer.from(process.env.CA_CERT!, 'base64').toString('utf-8'),
      rejectUnauthorized: true,
    };

    const req = https.request('https://localhost:3001', {method: 'GET', ...options}, (res) => {
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
    data: response.data
  })
})

export default router
