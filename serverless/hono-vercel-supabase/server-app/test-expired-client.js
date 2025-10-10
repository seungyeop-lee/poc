#!/usr/bin/env node

import https from 'https'
import fs from 'fs'
import path from 'path'

console.log('유효하지 않은(CA 미서명) 클라이언트 인증서 테스트 시작...')
console.log('테스트 목적: CA로 서명되지 않은 클라이언트 인증서 사용 시 연결 거부 확인')

// CA 인증서와 유효하지 않은 클라이언트 인증서 로드
const caPath = path.resolve(process.cwd(), '../mtls/certs/ca.crt')
const invalidCertPath = path.resolve(process.cwd(), '../mtls/certs/expired-client.crt')
const invalidKeyPath = path.resolve(process.cwd(), '../mtls/certs/expired-client.key')

const httpsOptions = {
  cert: fs.readFileSync(invalidCertPath, 'utf8'),
  key: fs.readFileSync(invalidKeyPath, 'utf8'),
  ca: fs.readFileSync(caPath, 'utf8'),
  rejectUnauthorized: true,
  servername: 'localhost'
}

console.log(`서버 주소: https://localhost:8443`)
console.log(`사용할 클라이언트 인증서: ${invalidCertPath}`)
console.log('인증서 특성: CA로 서명되지 않은 자체 서명 인증서')

const req = https.request('https://localhost:8443', httpsOptions, (res) => {
  console.log(`예기치 않은 응답 수신: 상태 코드 ${res.statusCode}`)

  let data = ''
  res.on('data', (chunk) => {
    data += chunk.toString()
  })

  res.on('end', () => {
    console.log('응답 내용:', data)
    console.log('❌ 테스트 실패: 유효하지 않은 인증서가 허용됨')
    process.exit(1)
  })
})

req.on('error', (error) => {
  console.log('✅ 예상된 에러 발생:', error.message)
  if (error.message.includes('certificate') || error.message.includes('SSL') || error.code === 'ECONNRESET') {
    console.log('✅ CA로 서명되지 않은 클라이언트 인증서 접속이 적절히 거부됨')
    console.log('✅ 테스트 성공')
    process.exit(0)
  } else {
    console.log('❌ 예상과 다른 에러:', error.message)
    console.log('에러 코드:', error.code)
    process.exit(1)
  }
})

req.on('socket', (socket) => {
  socket.on('secureConnect', () => {
    console.log('TLS 연결 수립 완료 (유효하지 않은 클라이언트 인증서)')
  })

  socket.on('error', (error) => {
    console.log('소켓 에러:', error.message)
  })
})

req.end()