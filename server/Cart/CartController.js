import CartModel from './CartModel';

export default class CartController {
  constructor(userId) {
    this.userId = userId;
  }

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

  getCart(req, res) {
    CartModel.find({ user_id: this.userId })
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
}
