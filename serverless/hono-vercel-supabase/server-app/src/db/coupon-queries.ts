import {db} from "./index.js";
import {coupon, InsertCoupon, SelectCoupon} from "./coupon.js";
import {eq} from "drizzle-orm";

export async function createCoupon(data: InsertCoupon) {
  await db.insert(coupon).values(data);
}

export async function getCouponByCode(code: string): Promise<SelectCoupon[]> {
  return db.select().from(coupon).where(eq(coupon.code, code));
}
