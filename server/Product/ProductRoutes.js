import express from 'express';
import ProductController from './ProductController';

const productRouter = express.Router();
const productCtrl = new ProductController();

productRouter.get('/list', (req, res) => productCtrl.lists(req, res));
productRouter.post('/generate', (req, res) => productCtrl.generate(req, res));
productRouter.post('/create', (req, res) => productCtrl.create(req, res));
productRouter.delete('/delete/:productId*?', (req, res) => productCtrl.remove(req, res));
productRouter.get('/get/:productId*?', (req, res, next) => productCtrl.getProduct(req, res, next));

export default productRouter;
