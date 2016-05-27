import express from 'express';
import faker from 'faker';
import Product from '../models/Product';

const router = express.Router();

router.get('/generate', function (req, res) {
  const product = new Product();
  let products = [];

  for (var i = 0; i < 10; i++) {
    products.push({
      name: faker.commerce.productName(),
      color: faker.commerce.color(),
      price: faker.commerce.price()
    });
  }

  product.collection.insert(products, function (err) {
    if (err) res.send(err);

    res.json(products);
  });
});

export default router;
