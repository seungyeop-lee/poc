import { serve } from '@hono/node-server';
import { createServer } from 'https';
import { Hono } from 'hono';
import { loadCertificates, validateCertificates } from './cert-loader.js';
const app = new Hono();
// 요청 로깅 미들웨어
app.use('*', async (c, next) => {
    const start = Date.now();
    const clientCert = c.req.header('x-client-cert-subject') || 'Unknown';
    const clientIP = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'Unknown';
    console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url} - Client: ${clientCert}, IP: ${clientIP}`);
    await next();
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url} - ${c.res.status} (${duration}ms)`);
});
app.get('/', (c) => {
    const clientCertSubject = c.req.header('x-client-cert-subject');
    const clientCertIssuer = c.req.header('x-client-cert-issuer');
    console.log('메인 요청 수신:');
    if (clientCertSubject) {
        console.log(`  - 클라이언트 인증서 주체: ${clientCertSubject}`);
    }
    if (clientCertIssuer) {
        console.log(`  - 클라이언트 인증서 발급자: ${clientCertIssuer}`);
    }
    return c.json({
        message: 'Hello mTLS!',
        timestamp: new Date().toISOString(),
        server: 'mTLS Server',
        clientAuthenticated: !!clientCertSubject
    });
});
app.get('/health', (c) => {
    return c.json({ status: 'ok', message: 'mTLS 서버가 정상적으로 동작 중입니다.' });
});
async function startServer() {
    try {
        console.log('mTLS 서버 시작 중...');
        // 인증서 로드
        const certConfig = loadCertificates();
        // 인증서 검증
        if (!validateCertificates(certConfig)) {
            throw new Error('인증서 검증 실패');
        }
        // HTTPS 서버 옵션 설정 (mTLS 설정)
        const httpsOptions = {
            cert: certConfig.cert,
            key: certConfig.key,
            ca: certConfig.ca,
            requestCert: true, // 클라이언트 인증서 요청
            rejectUnauthorized: true // 유효하지 않은 클라이언트 인증서 거부
        };
        // 포트 설정 (환경변수 또는 기본값 8443)
        const port = parseInt(process.env.PORT || '8443', 10);
        // HTTPS 서버 생성
        const server = createServer(httpsOptions, (req, res) => {
            app.fetch(req, res);
        });
        // 클라이언트 연결 로깅
        server.on('secureConnection', (tlsSocket) => {
            const cert = tlsSocket.getPeerCertificate();
            if (cert && cert.subject) {
                console.log(`클라이언트 연결 수립: ${cert.subject.CN || cert.subject.O || 'Unknown Client'}`);
                console.log(`  발급자: ${cert.issuer?.CN || cert.issuer?.O || 'Unknown Issuer'}`);
                console.log(`  유효기간: ${cert.valid_from} ~ ${cert.valid_to}`);
            }
            else {
                console.log('클라이언트 연결 시도: 인증서 없음');
            }
        });
        // 서버 시작
        server.listen(port, () => {
            console.log(`mTLS 서버가 https://localhost:${port} 에서 시작되었습니다.`);
            console.log('클라이언트 인증서 검증이 활성화되어 있습니다.');
            console.log(`Health check: https://localhost:${port}/health`);
            console.log(`서버 상태: 정상 동작 중`);
            console.log(`인증서 로드 방식: ${process.env.TLS_CERT ? '환경변수' : '파일'}`);
        });
        // 서버 에러 핸들링
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`포트 ${port}가 이미 사용 중입니다.`);
            }
            else {
                console.error('서버 에러:', error);
            }
            process.exit(1);
        });
        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n서버를 종료합니다...');
            server.close(() => {
                console.log('서버가 종료되었습니다.');
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error('서버 시작 실패:', error);
        process.exit(1);
    }
}
// 서버 시작
startServer();
