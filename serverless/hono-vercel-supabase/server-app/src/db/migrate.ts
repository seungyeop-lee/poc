import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

export async function runMigrations() {
  console.log('🔄 Starting database migrations...')

  const migrationClient = postgres(process.env.DATABASE_URL!, {
    max: 1,
    prepare: false
  })

  try {
    const db = drizzle(migrationClient)
    await migrate(db, { migrationsFolder: './drizzle' })
    console.log('✅ Database migrations completed successfully')
  } catch (error) {
    console.error('❌ Database migration failed:', error)
    throw error
  } finally {
    await migrationClient.end()
  }
}
