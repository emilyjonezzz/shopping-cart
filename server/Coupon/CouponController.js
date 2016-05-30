import Coupon from './CouponModel';
import faker from 'faker';

export default class CouponController {

  /**
   * Generate 5 digit alphanumeric code.
   * @return {[type]} [description]
   */
  generateCode() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let text = '';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
  /**
   * Generate 5 coupons
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  generate(req, res) {
    const coupon = new Coupon();
    const coupons = [];

    for (let i = 0; i < 5; i++) {
      coupons.push({
        name: faker.commerce.product(),
        description: faker.lorem.words(),
        price: faker.commerce.price(),
        code: this.generateCode(),
        createdAt: new Date(),
      });
    }

    coupon.collection.insert(coupons, (err, raw) => {
      if (err) res.status(400).send(err.stack);

      res.json({ status: 200, message: raw.ops });
    });
  }

  /**
   * Create a single coupon.
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  create(req, res, next) {
    const coupon = new Coupon({
      name: req.body.name,
      color: req.body.color,
      price: req.body.price,
      createdAt: new Date(),
    });

    coupon.saveAsync()
            .then((saveCoupons) => res.json(saveCoupons))
            .error((err) => next(err));
  }

  /**
   * Remove a coupon.
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  remove(req, res) {
    if (req.params.couponId === undefined) {
      res.status(400).send('Missing coupon id');
      return;
    }

    Coupon.findByIdAndRemove(req.params.couponId, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.json(req.params.couponId);
      }
    });
  }

  /**
   * List all coupons.
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  lists(req, res) {
    Coupon.find({}, (err, coupons) => {
      if (err) res.send(err);
      res.send(coupons);
    });
  }

  /**
   * Get a coupon.
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  getCoupon(req, res) {
    if (req.params.couponId === undefined) {
      res.status(400).send('Missing coupon id');
      return;
    }

    Coupon.findById(req.params.couponId, (err, coupon) => {
      if (err) {
        throw new Error(err);
      }

      res.json(coupon);
    });
  }
}
