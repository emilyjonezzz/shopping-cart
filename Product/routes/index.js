import express from 'express';
import faker from 'faker';
import productCtrl from '../controllers/Product';

const productRouter = express.Router();

productRouter.get('/generate', productCtrl.generate);
productRouter.post('/create', productCtrl.create);

export default productRouter;
