/*eslint-disable*/

import supertest from 'supertest';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import should from 'should';
import faker from 'faker';
import app from '../';
import config from '../config/env';
import CartModel from '../server/Cart/CartModel';

const dbUri = 'mongodb://root:root@ds015953.mlab.com:15953/shopping-cart';
const clearDb = require('mocha-mongoose')(dbUri);
const request = supertest;

describe('Product API', () => {
  const userId = 1;

  before(function (done) {
    if (mongoose.connection.db) return done();
    Promise.promisifyAll(mongoose);

    mongoose.connect(dbUri);

    const Cart = new CartModel({
      user_id: userId,
    });

    Cart.save((err, cart) => {
      done();
    });
  });

  it('should create a cart', function (done) {
    const Cart = new CartModel({
      user_id: userId,
    });

    Cart.save((err, cart) => {
      cart.should.be.an.instanceOf(Object);

      done();
    });
  });

  it('should get current cart data', function (done) {
    CartModel
      .find({ user_id: this.userId })
      .execAsync()
      .then((retrievedCart) => {
        retrievedCart.should.be.an.instanceOf(Object);

        done();
      });
  });
});
