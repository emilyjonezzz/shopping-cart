/*eslint-disable*/

import supertest from 'supertest';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import should from 'should';
import faker from 'faker';
import app from '../';
import config from '../config/env';
import ProductModel from '../server/Product/ProductModel';

const dbUri = 'mongodb://root:root@ds015953.mlab.com:15953/shopping-cart';
const clearDb = require('mocha-mongoose')(dbUri);
const request = supertest;

describe('Product API', () => {
  let newProduct;
  let batchProducts;

  before(function (done) {
    if (mongoose.connection.db) return done();
    Promise.promisifyAll(mongoose);

    mongoose.connect(dbUri, done);
  });

  it('should generate 10 random products', function (done) {
    const product = new ProductModel();
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
      raw.should.be.an.instanceOf(Object);
      raw.result.should.be.an.instanceOf(Object);
      raw.result.n.should.be.equal(10);

      batchProducts = raw.ops;
      done();
    });
  });

  it('should lists all products', function (done) {
    const product = new ProductModel();
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
      ProductModel.find({}, (err, products) => {
        products.should.be.not.empty();
        products.should.be.an.instanceOf(Object);

        done();
      });
    });
  });

  it('should delete a product', function (done) {
    const product = new ProductModel({
      name: 'Test Product',
      color: 'Turqoise',
      price: 500,
      createdAt: new Date(),
    });

    product.saveAsync()
            .then((saveProduct) => {
              ProductModel.findByIdAndRemove(saveProduct._id, (err, res) => {
                (err === null).should.be.true;
                res._id.should.be.an.instanceOf(Object);

                done();
              });
            });

  });

  it('should create a product', function (done) {
    const product = new ProductModel({
      name: 'Test Product',
      color: 'Turqoise',
      price: 500,
      createdAt: new Date(),
    });

    product.saveAsync()
            .then((saveProducts) => {
              saveProducts.should.be.an.instanceOf(Object);
              saveProducts.name.should.equal(product.name);
              saveProducts.price.should.equal(product.price);
              saveProducts.color.should.equal(product.color);
              newProduct = saveProducts;

              done();
            });
  });


  it('should retrieve single product data', function (done) {
    const product = new ProductModel({
      name: 'Test Product',
      color: 'Turqoise',
      price: 500,
      createdAt: new Date(),
    });

    product.saveAsync()
            .then(function (saveProducts) {
              saveProducts.should.be.an.instanceOf(Object);
              saveProducts.name.should.equal(product.name);
              saveProducts.price.should.equal(product.price);
              saveProducts.color.should.equal(product.color);
              return saveProducts;
            })
            .then((saveProducts) => {
              ProductModel.findById(saveProducts._id.toString(), (err, retrievedProduct) => {
                (err === null).should.be.true;

                retrievedProduct.should.be.an.instanceOf(Object);
                retrievedProduct.name.should.equal(saveProducts.name);
                retrievedProduct.price.should.equal(saveProducts.price);
                retrievedProduct.color.should.equal(saveProducts.color);

                done();
              });
            });
  });
});
