import { Hono } from 'hono'
import { db } from './db/connection.js'
import { testTable } from './db/schema.js'
import { testMtlsConnection } from './utils/mtls-client.js'
import { runAllFailTests } from './utils/mtls-fail-tests.js'

const app = new Hono()

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

// Database connection test endpoint
app.get('/db-test', async (c) => {
  try {
    // Query all records from test table
    let result = await db.select().from(testTable)

    // If table is empty, insert sample data
    if (result.length === 0) {
      console.log('📝 Test table is empty, inserting sample data...')

      await db.insert(testTable).values([
        { name: 'Sample User 1' },
        { name: 'Sample User 2' },
        { name: 'Sample User 3' }
      ])

      // Fetch again after insertion
      result = await db.select().from(testTable)

      return c.json({
        status: 'success',
        message: 'Database connection successful (sample data created)',
        timestamp: new Date().toISOString(),
        dataInserted: true,
        records: result
      })
    }

    return c.json({
      status: 'success',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      dataInserted: false,
      records: result
    })
  } catch (error: any) {
    return c.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500)
  }
})

// mTLS connection test endpoint
app.get('/mtls-test', async (c) => {
  try {
    const result = await testMtlsConnection()

    if (result.success) {
      return c.json({
        status: 'success',
        message: 'mTLS connection successful',
        timestamp: new Date().toISOString(),
        mtlsResult: result.data
      })
    } else {
      return c.json({
        status: 'error',
        message: 'mTLS connection failed',
        error: result.error,
        timestamp: new Date().toISOString()
      }, 500)
    }
  } catch (error: any) {
    return c.json({
      status: 'error',
      message: 'mTLS test error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500)
  }
})

// mTLS fail test endpoint
app.get('/mtls-fail-test', async (c) => {
  try {
    const results = await runAllFailTests()

    return c.json({
      status: 'success',
      message: 'mTLS fail tests completed',
      timestamp: new Date().toISOString(),
      results
    })
  } catch (error: any) {
    return c.json({
      status: 'error',
      message: 'mTLS fail test error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500)
  }
})

// Root endpoint
app.get('/', (c) => c.text('Hono server with Vercel, Drizzle ORM, and mTLS support'))

export default app
