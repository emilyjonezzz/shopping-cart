import express from 'express';
import CartController from './CartController';

const cartRouter = express.Router();
const userId = 1;
const cartCtrl = new CartController(userId);

cartRouter.get('/', (req, res) => {
  cartCtrl.getCart(req, res);
});
// cartRouter.get('/generate', cartCtrl.generate);
// cartRouter.post('/create', cartCtrl.create);
// cartRouter.delete('/delete/:id', cartCtrl.remove);
// cartRouter.get('/:id', cartCtrl.getProduct);

export default cartRouter;
