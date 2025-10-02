import { serve } from '@hono/node-server'
import app from './index.js'
import { runMigrations } from './db/migrate.js'

const port = 3000

// Run migrations before starting the server
async function startServer() {
  try {
    await runMigrations()
  } catch (error) {
    console.error('Failed to run migrations, but continuing server startup...')
  }

  console.log(`Hono 서버가 http://localhost:${port} 에서 실행 중입니다`)

  serve({
    fetch: app.fetch,
    port
  })
}

startServer()
