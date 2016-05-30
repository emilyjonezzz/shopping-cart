import Promise from 'bluebird';
import CartModel from './CartModel';
import ProductModel from '../Product/ProductModel';
import CouponModel from '../Coupon/CouponModel';

export default class CartController {
  constructor(userId) {
    this.userId = userId;
  }

  /**
   * Create cart for the current user.
   * @param  {[type]} userId [description]
   * @return {[type]}        [description]
   */
  createCart(userId) {
    const Cart = new CartModel({
      user_id: userId,
    });

    Cart.save((err, cart) => {
      if (err) return err;

      return cart;
    });

    return Cart;
  }

  /**
   * Get cart data. It will create a cart automatically,
   * if the current user didn't have cart yet.
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  getCart(req, res) {
    CartModel
      .find({ user_id: this.userId })
      .execAsync()
      .then((retrievedCart) => {
        let cart;

        if (retrievedCart.length === 0) {
          cart = this.createCart(this.userId);
        } else {
          cart = retrievedCart;
        }

        res.json({ status: 200, message: cart });
      })
      .error((err) => {
        res.json({ status: 500, message: err });
      });
  }

  getCartAsync() {
    return CartModel.find({ user_id: this.userId }).execAsync();
  }

  /**
   * Clear user cart.
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  clearCart(req, res) {
    CartModel.update({ user_id: this.userId },
      {
        $set: { products: [], totalQty: 0, totalPrice: 0 },
      },
      (err, affected) => {
        if (err) res.status(500).send('Critical error');

        res.json({ status: 200, message: affected });
      }
    );
  }

  /**
   * Add an item to cart
   * @param {[type]} req [description]
   * @param {[type]} res [description]
   */
  addToCart(req, res) {
    const product = ProductModel;
    const cart = CartModel;

    Promise.props({
      product: product.findById(req.params.itemId).execAsync(),
      cart: cart.find({ user_id: this.userId }).execAsync(),
    })
    .then((results) => {
      let createdCart;

      // Create cart first if there's no cart for this user
      if (results.cart.length === 0) {
        createdCart = this.createCart(this.userId);
      }

      // If successfully created a cart
      // or this user already have a cart
      if (createdCart || results.cart.length) {
        const id = results.cart[0]._id || createdCart[0]._id; //eslint-disable-line

        // Update product quantity and add cart id to it
        product.update({ _id: req.params.itemId, qty: { $gte: 1 } },
          {
            $inc: { qty: -1 },
            $push: {
              in_carts: {
                cart_id: id,
                qty: 1,
                user_id: this.userId,
                created_at: new Date(),
              },
            },
          },
          { strict: false },
          (insertProductErr, insertProductRaw) => {
            // If there's no qty remaining for the current product
            if (parseInt(insertProductRaw.nModified, 10) === 0) {
              // Remove the currently added product
              cart.update({ user_id: this.userId },
                {
                  $set: {
                    updated_at: new Date(),
                  },
                  $pull: {
                    products: { productId: req.params.itemId.toString() },
                  },
                },
                {},
                () => {
                  res.json({ status: 200, message: 'Sorry! This product is empty' });
                }
              );
            } else {
              // Insert product into cart collection
              cart.update({ user_id: this.userId },
                {
                  $set: {
                    updated_at: new Date(),
                  },
                  $inc: {
                    totalPrice: results.product.price,
                    totalQty: 1,
                  },
                  $push: {
                    products: {
                      productId: results.product._id.toString(), // eslint-disable-line
                      qty: 1,
                      price: results.product.price,
                      name: results.product.name,
                    },
                  },
                },
                {},
                () => {
                  res.json({ status: 200, message: `${results.product.name} added successfully` });
                }
              );
            }
          }
        );
      }
    });
  }

  /**
   * Remove an item from cart.
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  removeFromCart(req, res) {
    const itemId = req.params.itemId;

    this.getTotalQtyBeforeUpdate(itemId).then((qty) => {
      // Remove specific product from cart
      this.pullProducts(itemId)
          .then((resUpdate) => {
            if (!resUpdate.ok) {
              res.json({
                status: 500,
                message: 'Something wrong while deleting your item',
              });
            }

            this.sumTotalPriceAndQty()
                .then((total) => {
                  this.updateTotalPriceAndQty(total)
                      .then((resUpdateTotal) => {
                        if (!resUpdateTotal.ok) {
                          res.json({
                            status: 500,
                            message: 'Something wrong while updating your cart',
                          });
                        }
                      });
                })
                .then(() => {
                  if (qty.length > 0) {
                    ProductModel.update({ _id: itemId },
                      {
                        $inc: { qty: Number(qty[0].totalQty) },
                        $set: {
                          updated_at: new Date(),
                        },
                      }
                    ).then(() => {});
                  }

                  res.json({
                    status: 200,
                    message: 'Your item has been successfully deleted',
                  });
                });
          });
    });
  }

  /**
   * Pull / delete product from cart array.
   * @param  {[type]} itemId [description]
   * @return {[type]}        [description]
   */
  pullProducts(itemId) {
    return CartModel.update({ user_id: this.userId },
      {
        $pull: {
          products: { productId: itemId },
        },
      }
    );
  }

  /**
   * Get total qty from cart before update operation.
   * @param  {[type]} itemId [description]
   * @return {[type]}        [description]
   */
  getTotalQtyBeforeUpdate(itemId) {
    return CartModel.aggregate()
                    .unwind('products')
                    .match({
                      'products.productId': itemId,
                    })
                    .group({
                      _id: '',
                      totalQty: { $sum: '$products.qty' },
                    })
                    .execAsync();
  }

  /**
   * Sum total price and qty for current cart
   * @return {[type]} [description]
   */
  sumTotalPriceAndQty() {
    return CartModel.aggregate()
                    .unwind('products')
                    .group({
                      _id: '',
                      totalQty: { $sum: '$products.qty' },
                      totalPrice: { $sum: '$products.price' },
                    })
                    .project({
                      totalQty: 1,
                      totalPrice: 1,
                    })
                    .execAsync();
  }

  /**
   * Update total price and qty on cart collection.
   * @param  {[type]} total [description]
   * @return {[type]}       [description]
   */
  updateTotalPriceAndQty(total) {
    return CartModel.update({ user_id: this.userId },
      {
        updated_at: new Date,
        totalPrice: total.length > 0 ? total[0].totalPrice : 0,
        totalQty: total.length > 0 ? total[0].totalQty : 0,
      },
      { strict: false }
    );
  }

  /**
   * Apply coupon to a cart using coupon code.
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  applyCoupon(req, res) {
    this.getCartAsync()
        .then((cartData) => {
          if (cartData[0].products.length > 0) {
            this.getCouponData(req.params.code)
                .then((couponData) => {
                  if (couponData.length === 0) {
                    res.status(400).send('No such coupon code!');
                    return;
                  }

                  CartModel.update({ user_id: this.userId },
                    {
                      $set: {
                        totalPrice: this.calculateTotalAfterApplyCoupon(cartData[0].totalPrice, couponData[0].price), //eslint-disable-line
                        updated_at: new Date(),
                        coupon: [{
                          name: couponData[0].name,
                          price: couponData[0].price,
                          code: req.params.code,
                        }],
                      },
                    },
                    {},
                    (response) => {
                      res.json({ status: 200, message: response });
                    }
                  );
                });
          }
        });
  }

  /**
   * Get coupon data by coupon code.
   * @param  {[type]} couponCode [description]
   * @return {[type]}            [description]
   */
  getCouponData(couponCode) {
    return CouponModel.find({ code: couponCode })
                      .execAsync();
  }

  /**
   * Calculate cart total price after applied coupon.
   * @param  {[type]} totalPrice  [description]
   * @param  {[type]} couponPrice [description]
   * @return {[type]}             [description]
   */
  calculateTotalAfterApplyCoupon(totalPrice, couponPrice) {
    return parseFloat(totalPrice) - parseFloat(couponPrice);
  }

}
