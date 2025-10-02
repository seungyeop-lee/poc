import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options = {
  key: process.env.SERVER_KEY || fs.readFileSync(path.join(__dirname, '../certs/server/server.key'), 'utf8'),
  cert: process.env.SERVER_CERT || fs.readFileSync(path.join(__dirname, '../certs/server/server.crt'), 'utf8'),
  ca: process.env.CA_CERT || fs.readFileSync(path.join(__dirname, '../certs/ca/ca.crt'), 'utf8'),
  requestCert: true,  // 클라이언트 인증서 요청
  rejectUnauthorized: true  // 검증되지 않은 인증서 거부
}

const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    message: 'mTLS connection successful',
    path: req.url,
    timestamp: new Date().toISOString()
  }))
})

const PORT = 8443

server.listen(PORT, () => {
  console.log(`mTLS 테스트 서버가 https://localhost:${PORT} 에서 실행 중입니다`)
  console.log('클라이언트 인증서를 사용하여 연결하세요')
})
