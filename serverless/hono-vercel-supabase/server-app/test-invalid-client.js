#!/usr/bin/env node

import https from 'https'
import fs from 'fs'
import path from 'path'

console.log('유효하지 않은 클라이언트 인증서 테스트 시작...')
console.log('테스트 목적: 유효하지 않은 클라이언트 인증서 사용 시 연결 거부 확인')

// 서버 CA 인증서는 올바르게 로드
const caPath = path.resolve(process.cwd(), '../mtls/certs/ca.crt')
const httpsOptions = {
  ca: fs.readFileSync(caPath, 'utf8'),
  rejectUnauthorized: true,
  servername: 'localhost'
}

console.log(`서버 주소: https://localhost:8443`)
console.log('사용할 클라이언트 인증서: 없음 (유효하지 않은 경우)')

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
    console.log('✅ 유효하지 않은 클라이언트 인증서 접속이 적절히 거부됨')
    console.log('✅ 테스트 성공')
    process.exit(0)
  } else {
    console.log('❌ 예상과 다른 에러:', error.message)
    process.exit(1)
  }
})

req.on('socket', (socket) => {
  socket.on('secureConnect', () => {
    console.log('TLS 연결 수립 완료 (클라이언트 인증서 없음)')
  })

  socket.on('error', (error) => {
    console.log('소켓 에러:', error.message)
  })
})

// 클라이언트 인증서 없이 요청 전송
req.end()