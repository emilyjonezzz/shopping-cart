import express from 'express';
import productRoutes from '../server/Product/ProductRoutes';

const router = express.Router();

router.use('/product', productRoutes);

export default router;
