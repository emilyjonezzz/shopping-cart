import express from 'express';
import productRoutes from '../server/Product/ProductRoutes';
import cartRoutes from '../server/Cart/CartRoutes';
import couponRoutes from '../server/Coupon/CouponRoutes';

const router = express.Router();

router.use('/product', productRoutes);
router.use('/cart', cartRoutes);
router.use('/coupon', couponRoutes);

export default router;
