import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import {z} from "zod";

const app = new Hono()
  .get('/', (c) => {
    return c.text('Hello Hono!')
  })
  .post(
    '/',
    zValidator(
      'form',
      z.object({
        title: z.string(),
        body: z.string(),
      })
    ),
    (c) => {
      return c.json(
        {
          ok: true,
          message: 'Created!',
        },
        201
      )
    }
  )

export default app;
