import {boolean, pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";

export const coupon = pgTable('coupon', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  usedAt: timestamp('used_at'),
});

export type InsertCoupon = typeof coupon.$inferInsert;
export type SelectCoupon = typeof coupon.$inferSelect;
