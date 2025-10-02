import { Client } from 'undici'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 테스트 결과 타입
interface TestResult {
  scenario: string
  success: boolean
  error?: string
  statusCode?: number
}

// 전체 실패 테스트 결과 타입
export interface FailTestResults {
  timestamp: string
  tests: TestResult[]
  summary: {
    total: number
    expectedFailures: number
    unexpectedSuccess: number
  }
}

// 잘못된 PEM 문자열 생성
function createInvalidPemString(type: 'cert' | 'ca'): string {
  return `-----BEGIN CERTIFICATE-----
INVALID_${type.toUpperCase()}_DATA_FOR_TESTING
THIS_IS_NOT_A_VALID_CERTIFICATE
-----END CERTIFICATE-----`
}

// 시나리오 1: 클라이언트 인증서 없이 연결 시도
async function testWithoutClientCert(): Promise<TestResult> {
  try {
    const ca = process.env.CA_CERT || fs.readFileSync(path.join(__dirname, '../../certs/ca/ca.crt'), 'utf8')
    const serverUrl = process.env.MTLS_SERVER_URL || 'https://localhost:8443'

    const client = new Client(serverUrl, {
      connect: {
        ca,
        // cert, key 제거 - 클라이언트 인증서 없이 연결 시도
        servername: 'localhost',
        rejectUnauthorized: true
      }
    })

    const { statusCode, body } = await client.request({
      path: '/secure',
      method: 'GET'
    })

    await body.text()

    // 예상과 다르게 성공한 경우
    return {
      scenario: 'Without Client Certificate',
      success: true,
      statusCode
    }
  } catch (error: any) {
    // 예상대로 실패한 경우
    return {
      scenario: 'Without Client Certificate',
      success: false,
      error: error.message
    }
  }
}

// 시나리오 2: 잘못된 클라이언트 인증서로 연결 시도
async function testWithInvalidClientCert(): Promise<TestResult> {
  try {
    const ca = process.env.CA_CERT || fs.readFileSync(path.join(__dirname, '../../certs/ca/ca.crt'), 'utf8')
    const key = process.env.CLIENT_KEY || fs.readFileSync(path.join(__dirname, '../../certs/client/client.key'), 'utf8')
    const serverUrl = process.env.MTLS_SERVER_URL || 'https://localhost:8443'

    const client = new Client(serverUrl, {
      connect: {
        ca,
        cert: createInvalidPemString('cert'), // 잘못된 인증서
        key,
        servername: 'localhost',
        rejectUnauthorized: true
      }
    })

    const { statusCode, body } = await client.request({
      path: '/secure',
      method: 'GET'
    })

    await body.text()

    // 예상과 다르게 성공한 경우
    return {
      scenario: 'Invalid Client Certificate',
      success: true,
      statusCode
    }
  } catch (error: any) {
    // 예상대로 실패한 경우
    return {
      scenario: 'Invalid Client Certificate',
      success: false,
      error: error.message
    }
  }
}

// 시나리오 3: 잘못된 CA 인증서로 연결 시도
async function testWithWrongCA(): Promise<TestResult> {
  try {
    const cert = process.env.CLIENT_CERT || fs.readFileSync(path.join(__dirname, '../../certs/client/client.crt'), 'utf8')
    const key = process.env.CLIENT_KEY || fs.readFileSync(path.join(__dirname, '../../certs/client/client.key'), 'utf8')
    const serverUrl = process.env.MTLS_SERVER_URL || 'https://localhost:8443'

    const client = new Client(serverUrl, {
      connect: {
        ca: createInvalidPemString('ca'), // 잘못된 CA
        cert,
        key,
        servername: 'localhost',
        rejectUnauthorized: true
      }
    })

    const { statusCode, body } = await client.request({
      path: '/secure',
      method: 'GET'
    })

    await body.text()

    // 예상과 다르게 성공한 경우
    return {
      scenario: 'Wrong CA Certificate',
      success: true,
      statusCode
    }
  } catch (error: any) {
    // 예상대로 실패한 경우
    return {
      scenario: 'Wrong CA Certificate',
      success: false,
      error: error.message
    }
  }
}

// 모든 실패 테스트 실행
export async function runAllFailTests(): Promise<FailTestResults> {
  const tests: TestResult[] = []

  // 3가지 테스트 순차 실행
  tests.push(await testWithoutClientCert())
  tests.push(await testWithInvalidClientCert())
  tests.push(await testWithWrongCA())

  // Summary 계산
  const expectedFailures = tests.filter(t => !t.success).length
  const unexpectedSuccess = tests.filter(t => t.success).length

  return {
    timestamp: new Date().toISOString(),
    tests,
    summary: {
      total: tests.length,
      expectedFailures,
      unexpectedSuccess
    }
  }
}
