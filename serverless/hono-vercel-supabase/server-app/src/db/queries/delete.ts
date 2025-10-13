import { eq } from 'drizzle-orm';
import { db } from '../index.js';
import { SelectUser, usersTable } from '../schema.js';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
