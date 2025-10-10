import fs from 'fs'
import path from 'path'

interface CertificateConfig {
  cert: string
  key: string
  ca: string
}

/**
 * 환경변수에서 인증서 내용을 로드합니다.
 * 환경변수가 설정되지 않은 경우, 기본 파일 경로에서 인증서를 로드합니다.
 */
export function loadCertificates(): CertificateConfig {
  const tlsCert = process.env.TLS_CERT
  const tlsKey = process.env.TLS_KEY
  const caCert = process.env.CA_CERT

  let cert: string
  let key: string
  let ca: string

  if (tlsCert && tlsKey && caCert) {
    console.log('인증서를 환경변수에서 로드합니다...')
    cert = tlsCert
    key = tlsKey
    ca = caCert
  } else {
    console.log('인증서를 파일에서 로드합니다...')
    const certPath = path.resolve(process.cwd(), '../mtls/certs/server.crt')
    const keyPath = path.resolve(process.cwd(), '../mtls/certs/server.key')
    const caPath = path.resolve(process.cwd(), '../mtls/certs/ca.crt')

    try {
      cert = fs.readFileSync(certPath, 'utf8')
      key = fs.readFileSync(keyPath, 'utf8')
      ca = fs.readFileSync(caPath, 'utf8')
      console.log(`서버 인증서: ${certPath}`)
      console.log(`서버 개인키: ${keyPath}`)
      console.log(`CA 인증서: ${caPath}`)
    } catch (error) {
      console.error('인증서 파일 로드 실패:', error)
      throw new Error('인증서 파일을 찾을 수 없습니다. 먼저 인증서 생성 스크립트를 실행하세요.')
    }
  }

  return { cert, key, ca }
}

/**
 * 인증서 내용을 검증합니다.
 */
export function validateCertificates(config: CertificateConfig): boolean {
  try {
    // 기본적인 인증서 형식 검증
    if (!config.cert.includes('-----BEGIN CERTIFICATE-----')) {
      throw new Error('서버 인증서 형식이 올바르지 않습니다.')
    }
    if (!config.key.includes('-----BEGIN')) {
      throw new Error('서버 개인키 형식이 올바르지 않습니다.')
    }
    if (!config.ca.includes('-----BEGIN CERTIFICATE-----')) {
      throw new Error('CA 인증서 형식이 올바르지 않습니다.')
    }

    console.log('인증서 검증 완료')
    return true
  } catch (error) {
    console.error('인증서 검증 실패:', error)
    return false
  }
}