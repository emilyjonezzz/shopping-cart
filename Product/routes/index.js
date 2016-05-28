import express from 'express';
import faker from 'faker';
import productCtrl from '../controllers/Product';

const productRouter = express.Router();

productRouter.get('/', productCtrl.lists);
productRouter.get('/generate', productCtrl.generate);
productRouter.post('/create', productCtrl.create);
productRouter.delete('/delete/:id', productCtrl.remove);
productRouter.get('/:id', productCtrl.getProduct);

export default productRouter;
