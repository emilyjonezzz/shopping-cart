import Product from '../models/Product';
import faker from 'faker';

function generate(req, res, next) {
  const product = new Product();
  let products = [];

  for (var i = 0; i < 10; i++) {
    products.push({
      name: faker.commerce.productName(),
      color: faker.commerce.color(),
      price: faker.commerce.price(),
      createdAt: new Date()
    });
  }

  product.collection.insert(products, function (err) {
    if (err) res.send(err.stack);

    res.json(products);
  });
};

function create(req, res, next) {
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

function remove(req, res) {
  Product.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.send(err)
    } else {
      res.json(req.params.id);
    }
  });
};

function lists(req, res, next) {
  Product.find({}, function(err, products) {
    if (err) next(err);
    res.send(products);
  });
};

function getProduct(req, res, next) {
  Product.findById(req.params.id, function (err, product) {
    if (err) {
      next(err);
    } else {
      res.json(product);
    }
  });
}

export default { generate, create, remove, lists, getProduct };
