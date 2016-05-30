import Product from './ProductModel';
import faker from 'faker';

export default class ProductController {
  /**
   * Generate 10 products using faker >:)
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  generate(req, res) {
    if (req.method === 'GET') res.status(400).send('Wrong HTTP method');

    const product = new Product();
    const products = [];

    for (let i = 0; i < 10; i++) {
      products.push({
        name: faker.commerce.productName(),
        color: faker.commerce.color(),
        price: faker.commerce.price(),
        qty: Math.floor(Math.random() * 100 + 1),
        createdAt: new Date(),
      });
    }

    product.collection.insert(products, (err, raw) => {
      if (err) res.status(400).send(err.stack);

      res.json({ status: 200, message: raw.ops });
    });
  }

  /**
   * Create a single product.
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  create(req, res, next) {
    const product = new Product({
      name: req.body.name,
      color: req.body.color,
      price: req.body.price,
      createdAt: new Date(),
    });

    product.saveAsync()
            .then((saveProducts) => res.json(saveProducts))
            .error((err) => next(err));
  }

  /**
   * Remove a product.
   * @param  {[type]} req [description]
   * @param  {[type]} res [description]
   * @return {[type]}     [description]
   */
  remove(req, res) {
    Product.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.json(req.params.id);
      }
    });
  }

  lists(req, res) {
    Product.find({}, (err, products) => {
      if (err) res.send(err);
      res.send(products);
    });
  }

  /**
   * Get a product.
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  getProduct(req, res) {
    if (req.params.id === 'generate' || req.params.id === '') res.status(400).send('Missing id');

    Product.findById(req.params.id, (err, product) => {
      if (err) {
        throw new Error(err);
      }

      res.json(product);
    });
  }
}
