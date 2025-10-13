import {Hono} from 'hono'

const router = new Hono()

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono',
  `Current runtime: ${process.release?.name || 'unknown'}`,
]

router.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

export default router
