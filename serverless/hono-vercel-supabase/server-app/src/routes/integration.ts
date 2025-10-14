import {Hono} from "hono";
import {createCoupon, getCouponByCode} from "../db/coupon-queries.js";
import {mtlsGet} from "../utils/mtls.js";

const router = new Hono()

router.post('/coupon', async (c) => {
  try {
    const {data} = await mtlsGet('https://localhost:3001/coupon-code');
    if (!data) {
      return c.json({error: 'Invalid coupon code received'}, 500);
    }
    await createCoupon({code: data});
    return c.json({message: 'Coupon created successfully'}, 201);
  } catch (error) {
    console.error('Error creating coupon:', error);
    return c.json({error: 'Failed to create coupon'}, 500);
  }
});

router.get('/coupon/:code', async (c) => {
  try {
    const code = c.req.param('code');
    if (!code) {
      return c.json({error: 'Invalid Coupon code'}, 400);
    }

    const coupons = await getCouponByCode(code);
    if (coupons.length === 0) {
      return c.json({error: 'Coupon not found'}, 404);
    }

    return c.json(coupons[0]);
  } catch (error) {
    console.error('Error getting coupon:', error);
    return c.json({error: 'Failed to get coupon'}, 500);
  }
});

export default router
