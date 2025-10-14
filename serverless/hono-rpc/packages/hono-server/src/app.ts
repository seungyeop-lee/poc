import {Hono} from "hono";
import {cors} from "hono/cors";
import postsRouter from "./routes/posts.js";

export const app = new Hono()
  .use('*', cors())
  .route('/posts', postsRouter)
