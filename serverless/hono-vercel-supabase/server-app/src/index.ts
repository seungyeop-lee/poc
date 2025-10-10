import { Hono } from 'hono'
import https from 'https'
import { loadClientCertificates, validateClientCertificates } from './cert-loader.js'

const app = new Hono()

// mTLS 요청 함수
async function makeMTLSRequest(url: string, method: string = 'GET'): Promise<any> {
  try {
    console.log(`mTLS 요청 시작: ${method} ${url}`)

    // 클라이언트 인증서 로드
    const certConfig = loadClientCertificates()

    // 인증서 검증
    if (!validateClientCertificates(certConfig)) {
      throw new Error('클라이언트 인증서 검증 실패')
    }

    // HTTPS 옵션 설정 (mTLS 클라이언트 설정)
    const httpsOptions = {
      cert: certConfig.cert,
      key: certConfig.key,
      ca: certConfig.ca,
      rejectUnauthorized: true,  // 서버 인증서 검증
      servername: 'localhost'    // SNI 지원
    }

    console.log('HTTPS 요청 옵션 설정 완료')
    console.log(`서버 인증서 검증: 활성화`)
    console.log(`클라이언트 인증서 전송: 활성화`)

    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        method,
        ...httpsOptions,
        headers: {
          'User-Agent': 'mTLS-Client/1.0'
        }
      }, (res) => {
        console.log(`서버 응답 수신: 상태 코드 ${res.statusCode}`)

        let data = ''
        res.on('data', (chunk) => {
          data += chunk.toString()
        })

        res.on('end', () => {
          console.log('응답 데이터 수신 완료')
          try {
            const responseData = res.headers['content-type']?.includes('application/json')
              ? JSON.parse(data)
              : data
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: responseData
            })
          } catch (parseError) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: data
            })
          }
        })
      })

      req.on('error', (error) => {
        console.error('요청 에러:', error)
        reject(error)
      })

      req.on('socket', (socket) => {
        socket.on('secureConnect', () => {
          console.log('TLS 연결 수립 완료')
          // 서버 인증서 정보 로깅 (타입 안전하게 처리)
          try {
            const tlsSocket = socket as any
            if (tlsSocket.getPeerCertificate) {
              const cert = tlsSocket.getPeerCertificate()
              if (cert && cert.subject) {
                console.log(`서버 인증서 확인: ${cert.subject.CN || cert.subject.O}`)
              }
            }
          } catch (error) {
            console.log('서버 인증서 정보 조회 중 오류:', error)
          }
        })
      })

      // GET 요청이면 본문 없이 전송
      if (method === 'GET') {
        req.end()
      } else {
        req.end()
      }
    })

  } catch (error) {
    console.error('mTLS 요청 실패:', error)
    throw error
  }
}

app.get('/', (c) => {
  return c.json({
    message: 'mTLS 클라이언트 애플리케이션',
    endpoints: {
      '/test-mtls': 'mTLS 서버 통신 테스트 (https://localhost:8443)',
      '/test-mtls-health': 'mTLS 서버 상태 확인 (https://localhost:8443/health)',
      '/info': '클라이언트 정보'
    }
  })
})

app.get('/info', (c) => {
  try {
    const certConfig = loadClientCertificates()
    return c.json({
      clientType: 'mTLS Client',
      version: '1.0.0',
      runtime: process.release?.name || 'unknown',
      nodeVersion: process.version,
      certificateLoaded: true,
      loadMethod: process.env.CLIENT_CERT ? 'environment' : 'file',
      serverUrl: process.env.MTLS_SERVER_URL || 'https://localhost:8443',
      capabilities: {
        clientAuthentication: true,
        serverCertificateVerification: true,
        mutualTLS: true,
        logging: true
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return c.json({
      clientType: 'mTLS Client',
      version: '1.0.0',
      runtime: process.release?.name || 'unknown',
      nodeVersion: process.version,
      certificateLoaded: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500)
  }
})

app.get('/test-mtls', async (c) => {
  try {
    const serverUrl = process.env.MTLS_SERVER_URL || 'https://localhost:8443'
    console.log(`mTLS 서버 통신 테스트: ${serverUrl}`)

    const response = await makeMTLSRequest(serverUrl)

    return c.json({
      success: true,
      message: 'mTLS 통신 성공',
      serverResponse: response,
      clientInfo: {
        requestUrl: serverUrl,
        requestMethod: 'GET',
        certificateLoaded: true,
        serverCertificateVerified: true
      },
      performance: {
        timestamp: new Date().toISOString(),
        connectionType: 'mTLS'
      }
    })
  } catch (error) {
    console.error('mTLS 통신 실패:', error)
    return c.json({
      success: false,
      message: 'mTLS 통신 실패',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500)
  }
})

app.get('/test-mtls-health', async (c) => {
  try {
    const serverUrl = process.env.MTLS_SERVER_URL || 'https://localhost:8443/health'
    console.log(`mTLS 서버 상태 확인: ${serverUrl}`)

    const response = await makeMTLSRequest(serverUrl)

    return c.json({
      success: true,
      message: 'mTLS 서버 상태 확인 성공',
      serverResponse: response,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('mTLS 서버 상태 확인 실패:', error)
    return c.json({
      success: false,
      message: 'mTLS 서버 상태 확인 실패',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, 500)
  }
})

export default app
