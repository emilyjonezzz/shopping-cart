import Product from './ProductModel';
import faker from 'faker';

export default class ProductController {
  constructor() {
  }

  generate(req, res, next) {
    const product = new Product();
    let products = [];

    for (var i = 0; i < 10; i++) {
      products.push({
        name: faker.commerce.productName(),
        color: faker.commerce.color(),
        price: faker.commerce.price(),
        qty: Math.floor(Math.random() * 100 + 1),
        createdAt: new Date()
      });
    }

    product.collection.insert(products, function (err) {
      if (err) res.send(err.stack);

      res.json(products);
    });
  };

  create(req, res, next) {
    const product = new Product({
      name: req.body.name,
      color: req.body.color,
      price: req.body.price,
      createdAt: new Date()
    });

    product.saveAsync()
            .then((saveProducts) => res.json(saveProducts))
            .error((err) => next(err));
  };

  remove(req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        res.send(err)
      } else {
        res.json(req.params.id);
      }
    });
  };

  lists(req, res, next) {
    Product.find({}, function(err, products) {
      if (err) next(err);
      res.send(products);
    });
  };

  getProduct(req, res, next) {
    Product.findById(req.params.id, function (err, product) {
      if (err) {
        next(err);
      } else {
        res.json(product);
      }
    });
  }
}
