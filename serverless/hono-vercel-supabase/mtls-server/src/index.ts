import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {createServer} from "node:https";
import dotenv from 'dotenv'

dotenv.config()

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!!!')
})

serve({
  fetch: app.fetch,
  createServer: createServer,
  serverOptions: {
    key: Buffer.from(process.env.SERVER_KEY!, 'base64').toString('utf-8'),
    cert: Buffer.from(process.env.SERVER_CERT!, 'base64').toString('utf-8'),
    ca: Buffer.from(process.env.CA_CERT!, 'base64').toString('utf-8'),
    requestCert: true,
    rejectUnauthorized: true,
  },
  port: 3001
}, (info) => {
  console.log(`Server is running on https://localhost:${info.port}`)
})
