import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: String,
  color: String,
  price: Number
});

const Product = mongoose.model('Product', schema);

export default Product;
