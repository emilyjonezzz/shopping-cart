import express from 'express';
import faker from 'faker';
import productCtrl from '../controllers/Product';

const productRouter = express.Router();

productRouter.get('/', productCtrl.lists);
productRouter.get('/:id', productCtrl.get);
productRouter.get('/generate', productCtrl.generate);
productRouter.post('/create', productCtrl.create);
productRouter.delete('/delete/:id', productCtrl.remove);

export default productRouter;
