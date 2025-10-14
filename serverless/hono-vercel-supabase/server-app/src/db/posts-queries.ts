import {InsertPost, postsTable, SelectPost} from "./posts.js";
import {db} from "./index.js";
import {asc, between, eq, sql} from "drizzle-orm";

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}

export async function getPostsForLast24Hours(
  page = 1,
  pageSize = 5,
) {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
    })
    .from(postsTable)
    .where(between(
      postsTable.createdAt,
      sql`now() - interval '1 day'`,
      sql`now()`
    ))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
