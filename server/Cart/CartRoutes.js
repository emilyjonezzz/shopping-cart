import express from 'express';
import CartController from './CartController';

const cartRouter = express.Router();
const userId = 1;
const cartCtrl = new CartController(userId);

cartRouter.get('/', (req, res) => {
  cartCtrl.getCart(req, res);
});

cartRouter.delete('/clear', (req, res) => {
  cartCtrl.clearCart(req, res);
});

cartRouter.post('/add/:itemId', (req, res, next) => {
  cartCtrl.addToCart(req, res, next);
});

cartRouter.delete('/delete/:itemId', (req, res) => {
  cartCtrl.removeFromCart(req, res);
});

cartRouter.post('/applyCoupon/:code', (req, res) => {
  cartCtrl.applyCoupon(req, res);
});

export default cartRouter;
