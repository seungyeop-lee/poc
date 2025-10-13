import {Hono} from 'hono'
import {errorHandler} from './middlewares/errorHandler.js'
import indexRouter from './routes/index.js'
import testRouter from './routes/test.js'
import 'dotenv/config'

const app = new Hono()

// 전역 에러 핸들러
app.onError(errorHandler)

// 라우터 등록
app.route('/', indexRouter)
app.route('/test', testRouter)

export default app
