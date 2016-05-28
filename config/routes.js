import express from 'express';
import productRoutes from '../server/Product/ProductRoutes';
import cartRoutes from '../server/Cart/CartRoutes';

const router = express.Router();

router.use('/product', productRoutes);
router.use('/cart', cartRoutes);

export default router;
