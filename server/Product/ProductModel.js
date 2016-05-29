import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  color: String,
  price: Number,
  qty: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  in_carts: [{
    cart_id: mongoose.Schema.Types.ObjectId,
    qty: Number,
    user_id: mongoose.Schema.Types.Mixed,
    created_at: Date,
  }],
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
