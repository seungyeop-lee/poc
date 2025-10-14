import { hc } from 'hono/client'
import type { AppType } from '@hono-rpc/hono-server'

export const client = hc<AppType>('http://localhost:3000/')
