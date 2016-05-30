import express from 'express';
import CouponController from './CouponController';

const couponRouter = express.Router();
const couponCtrl = new CouponController();

couponRouter.get('/list', (req, res) => couponCtrl.lists(req, res));
couponRouter.post('/generate', (req, res) => couponCtrl.generate(req, res));
couponRouter.post('/create', (req, res) => couponCtrl.create(req, res));
couponRouter.delete('/delete/:couponId*?', (req, res) => couponCtrl.remove(req, res));
couponRouter.get('/get/:couponId*?', (req, res, next) => couponCtrl.getCoupon(req, res, next));

export default couponRouter;
