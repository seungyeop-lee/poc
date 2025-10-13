import { eq } from 'drizzle-orm';
import { db } from '../index.js';
import { SelectPost, postsTable } from '../schema.js';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
