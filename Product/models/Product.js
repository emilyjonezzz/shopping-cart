import Promise from 'bluebird';
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
            // .sort({ createdAt: -1})
            .limit(limit)
            .exec();
  },
  get(id) {
    return this.findById(id)
                .execAsync()
                .then((products) => {
                  if (products) {
                    return products;
                  }

                  Promise.reject('No product by that ID!');
                })
  }
};

const Product = mongoose.model('Product', ProductSchema);

export default Product;
