import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  color: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ProductSchema.statics = {
  list({ limit = 20 } = {}) {
    return this.find()
            .sort({ createdAt: -1})
            .limit(limit)
            .exec();
  }
};

const Product = mongoose.model('Product', ProductSchema);

export default Product;
