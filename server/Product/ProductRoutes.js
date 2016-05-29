import express from 'express';
import ProductController from './ProductController';

const productRouter = express.Router();
const productCtrl = new ProductController();

productRouter.get('/', productCtrl.lists);
productRouter.post('/generate', productCtrl.generate);
productRouter.post('/create', productCtrl.create);
productRouter.delete('/delete/:id', productCtrl.remove);
productRouter.get('/:id', productCtrl.getProduct);

export default productRouter;
