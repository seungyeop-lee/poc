import {integer, pgTable, serial, text} from "drizzle-orm/pg-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique()
});

export const userInsertSchema = createInsertSchema(usersTable);
export type InsertUser = z.infer<typeof userInsertSchema>;
export const userSelectSchema = createSelectSchema(usersTable)
export type SelectUser = z.infer<typeof userSelectSchema>;
