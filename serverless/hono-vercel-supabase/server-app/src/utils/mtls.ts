import https from 'https'

/**
 * mTLS 인증서 설정
 */
export interface MTLSCertificates {
  cert: string
  key: string
  ca: string
}

/**
 * mTLS 요청 옵션
 */
export interface MTLSRequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: string | object
  certificates?: MTLSCertificates
  rejectUnauthorized?: boolean
}

/**
 * mTLS 응답
 */
export interface MTLSResponse {
  statusCode: number
  contentType: string
  data: string
  headers: Record<string, string | string[] | undefined>
}

/**
 * 환경변수에서 mTLS 인증서를 로딩합니다.
 *
 * 환경변수:
 * - CLIENT_CERT: Base64 인코딩된 클라이언트 인증서
 * - CLIENT_KEY: Base64 인코딩된 클라이언트 개인키
 * - CA_CERT: Base64 인코딩된 CA 인증서
 */
export function loadCertificatesFromEnv(): MTLSCertificates {
  const clientCert = process.env.CLIENT_CERT
  const clientKey = process.env.CLIENT_KEY
  const caCert = process.env.CA_CERT

  if (!clientCert || !clientKey || !caCert) {
    throw new Error('Missing required certificate environment variables: CLIENT_CERT, CLIENT_KEY, CA_CERT')
  }

  return {
    cert: Buffer.from(clientCert, 'base64').toString('utf-8'),
    key: Buffer.from(clientKey, 'base64').toString('utf-8'),
    ca: Buffer.from(caCert, 'base64').toString('utf-8'),
  }
}

/**
 * mTLS를 사용하여 HTTPS 요청을 수행합니다.
 *
 * @param options - 요청 옵션
 * @returns Promise<MTLSResponse>
 *
 * @example
 * ```typescript
 * // 환경변수에서 인증서 자동 로딩
 * const response = await mtlsRequest({
 *   url: 'https://api.example.com/data',
 *   method: 'GET'
 * })
 *
 * // 커스텀 인증서 사용
 * const response = await mtlsRequest({
 *   url: 'https://api.example.com/data',
 *   method: 'POST',
 *   body: { foo: 'bar' },
 *   certificates: {
 *     cert: '...',
 *     key: '...',
 *     ca: '...'
 *   }
 * })
 * ```
 */
export async function mtlsRequest(options: MTLSRequestOptions): Promise<MTLSResponse> {
  const {
    url,
    method = 'GET',
    headers = {},
    body,
    certificates,
    rejectUnauthorized = true,
  } = options

  // 인증서 로딩: 제공되지 않으면 환경변수에서 자동 로딩
  const certs = certificates || loadCertificatesFromEnv()

  return new Promise<MTLSResponse>((resolve, reject) => {
    const requestOptions: https.RequestOptions = {
      method,
      headers: {
        ...headers,
        ...(body && typeof body === 'object' ? { 'Content-Type': 'application/json' } : {}),
      },
      cert: certs.cert,
      key: certs.key,
      ca: certs.ca,
      rejectUnauthorized,
    }

    const req = https.request(url, requestOptions, (res) => {
      let responseData = ''

      res.on('data', (chunk) => {
        responseData += chunk.toString()
      })

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode || 0,
          contentType: res.headers['content-type'] || '',
          data: responseData,
          headers: res.headers,
        })
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    // 바디가 있으면 전송
    if (body) {
      const bodyString = typeof body === 'object' ? JSON.stringify(body) : body
      req.write(bodyString)
    }

    req.end()
  })
}

/**
 * mTLS GET 요청을 수행합니다.
 */
export async function mtlsGet(url: string, options?: Omit<MTLSRequestOptions, 'url' | 'method'>): Promise<MTLSResponse> {
  return mtlsRequest({ ...options, url, method: 'GET' })
}

/**
 * mTLS POST 요청을 수행합니다.
 */
export async function mtlsPost(url: string, body?: string | object, options?: Omit<MTLSRequestOptions, 'url' | 'method' | 'body'>): Promise<MTLSResponse> {
  return mtlsRequest({ ...options, url, method: 'POST', body })
}

/**
 * mTLS PUT 요청을 수행합니다.
 */
export async function mtlsPut(url: string, body?: string | object, options?: Omit<MTLSRequestOptions, 'url' | 'method' | 'body'>): Promise<MTLSResponse> {
  return mtlsRequest({ ...options, url, method: 'PUT', body })
}

/**
 * mTLS DELETE 요청을 수행합니다.
 */
export async function mtlsDelete(url: string, options?: Omit<MTLSRequestOptions, 'url' | 'method'>): Promise<MTLSResponse> {
  return mtlsRequest({ ...options, url, method: 'DELETE' })
}
