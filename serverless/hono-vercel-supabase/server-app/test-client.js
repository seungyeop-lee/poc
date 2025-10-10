#!/usr/bin/env node

import https from 'https'
import fs from 'fs'
import path from 'path'

// 인증서 로드
const certPath = path.resolve(process.cwd(), '../mtls/certs/client.crt')
const keyPath = path.resolve(process.cwd(), '../mtls/certs/client.key')
const caPath = path.resolve(process.cwd(), '../mtls/certs/ca.crt')

console.log('mTLS 클라이언트 테스트 시작...')
console.log(`클라이언트 인증서: ${certPath}`)
console.log(`서버 주소: https://localhost:8443`)

const httpsOptions = {
  cert: fs.readFileSync(certPath, 'utf8'),
  key: fs.readFileSync(keyPath, 'utf8'),
  ca: fs.readFileSync(caPath, 'utf8'),
  rejectUnauthorized: true,
  servername: 'localhost'
}

const req = https.request('https://localhost:8443', httpsOptions, (res) => {
  console.log(`서버 응답 상태: ${res.statusCode}`)
  console.log(`응답 헤더:`, res.headers)

  let data = ''
  res.on('data', (chunk) => {
    data += chunk.toString()
  })

  res.on('end', () => {
    console.log('서버 응답 내용:')
    console.log(data)

    try {
      const jsonData = JSON.parse(data)
      console.log('\n파싱된 JSON 응답:')
      console.log(JSON.stringify(jsonData, null, 2))

      if (jsonData.message && jsonData.message.includes('Hello mTLS')) {
        console.log('\n✅ mTLS 통신 성공! "Hello mTLS" 응답 수신')
        process.exit(0)
      } else {
        console.log('\n❌ 예상과 다른 응답 수신')
        process.exit(1)
      }
    } catch (error) {
      console.log('\nJSON 파싱 실패:', error.message)
      process.exit(1)
    }
  })
})

req.on('error', (error) => {
  console.error('요청 에러:', error)
  process.exit(1)
})

req.on('socket', (socket) => {
  socket.on('secureConnect', () => {
    console.log('✅ TLS 연결 수립 완료')

    const tlsSocket = socket
    if (tlsSocket.getPeerCertificate) {
      const cert = tlsSocket.getPeerCertificate()
      if (cert && cert.subject) {
        console.log(`서버 인증서 확인: ${cert.subject.CN || cert.subject.O}`)
      }
    }

    console.log('✅ 클라이언트 인증서 전송 완료')
    console.log('✅ 상호 인증 성공')
  })
})

req.end()