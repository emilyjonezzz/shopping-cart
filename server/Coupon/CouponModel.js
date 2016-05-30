import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  code: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Coupon = mongoose.model('Coupon', CouponSchema);

export default Coupon;
