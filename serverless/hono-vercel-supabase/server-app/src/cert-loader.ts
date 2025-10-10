import fs from 'fs'
import path from 'path'

interface ClientCertificateConfig {
  cert: string
  key: string
  ca: string
}

/**
 * 환경변수에서 클라이언트 인증서 내용을 로드합니다.
 * 환경변수가 설정되지 않은 경우, 기본 파일 경로에서 인증서를 로드합니다.
 */
export function loadClientCertificates(): ClientCertificateConfig {
  const clientCert = process.env.CLIENT_CERT
  const clientKey = process.env.CLIENT_KEY
  const caCert = process.env.CA_CERT

  let cert: string
  let key: string
  let ca: string

  if (clientCert && clientKey && caCert) {
    console.log('클라이언트 인증서를 환경변수에서 로드합니다...')
    cert = clientCert
    key = clientKey
    ca = caCert
  } else {
    console.log('클라이언트 인증서를 파일에서 로드합니다...')
    const certPath = path.resolve(process.cwd(), '../mtls/certs/client.crt')
    const keyPath = path.resolve(process.cwd(), '../mtls/certs/client.key')
    const caPath = path.resolve(process.cwd(), '../mtls/certs/ca.crt')

    try {
      cert = fs.readFileSync(certPath, 'utf8')
      key = fs.readFileSync(keyPath, 'utf8')
      ca = fs.readFileSync(caPath, 'utf8')
      console.log(`클라이언트 인증서: ${certPath}`)
      console.log(`클라이언트 개인키: ${keyPath}`)
      console.log(`CA 인증서: ${caPath}`)
    } catch (error) {
      console.error('클라이언트 인증서 파일 로드 실패:', error)
      throw new Error('클라이언트 인증서 파일을 찾을 수 없습니다. 먼저 인증서 생성 스크립트를 실행하세요.')
    }
  }

  return { cert, key, ca }
}

/**
 * 클라이언트 인증서 내용을 검증합니다.
 */
export function validateClientCertificates(config: ClientCertificateConfig): boolean {
  try {
    // 기본적인 인증서 형식 검증
    if (!config.cert.includes('-----BEGIN CERTIFICATE-----')) {
      throw new Error('클라이언트 인증서 형식이 올바르지 않습니다.')
    }
    if (!config.key.includes('-----BEGIN')) {
      throw new Error('클라이언트 개인키 형식이 올바르지 않습니다.')
    }
    if (!config.ca.includes('-----BEGIN CERTIFICATE-----')) {
      throw new Error('CA 인증서 형식이 올바르지 않습니다.')
    }

    console.log('클라이언트 인증서 검증 완료')
    return true
  } catch (error) {
    console.error('클라이언트 인증서 검증 실패:', error)
    return false
  }
}