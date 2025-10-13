import type {ErrorHandler} from 'hono'

export const errorHandler: ErrorHandler = (err, c) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
  })

  return c.json({
    success: false,
    error: err.message || 'Internal Server Error',
  }, 500)
}
