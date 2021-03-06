import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  user_id: String,
  created_at: Date,
  updated_at: {
    type: Date,
    default: Date.now,
  },
  totalQty: Number,
  totalPrice: Number,
  products: [],
  coupon: [{
    name: String,
    price: Number,
    code: String,
  }],
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
