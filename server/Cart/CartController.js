import Promise from 'bluebird';
import CartModel from './CartModel';
import ProductModel from '../Product/ProductModel';

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
        // Update product quantity and add cart id to it
        product.update({ _id: req.params.itemId, qty: { $gte: 1 } },
          {
            $inc: { qty: -1 },
            $push: {
              in_carts: {
                qty: 1,
                _id: this.userId,
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
                  res.json({ status: 200, message: `Sorry! ${results.product.name} is empty` });
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
    const cart = CartModel;

    // Remove specific product from cart
    cart.update({ user_id: this.userId },
      {
        $pull: {
          products: { productId: req.params.itemId },
        },
      }
    )
    .then((resUpdate) => {
      if (!resUpdate.ok) {
        res.json(
          { status: 500, message: 'Something wrong while deleting your item' }
        );
      }

      this.sumTotalPriceAndQty()
          .then((total) => this.updateTotalPriceAndQty(total))
          .then((resUpdateTotal) => {
            if (!resUpdateTotal.ok) {
              res.json({ status: 500, message: 'Something wrong while updating your cart' });
            }

            res.json({ status: 200, message: 'Your item has been successfully deleted' });
          });
    });
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
        $set: {
          updated_at: new Date,
          totalPrice: total[0].totalPrice,
          totalQty: total[0].totalQty,
        },
      }
    );
  }
}
