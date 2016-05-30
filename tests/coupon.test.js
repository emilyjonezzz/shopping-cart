/*eslint-disable*/

import supertest from 'supertest';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import should from 'should';
import faker from 'faker';
import app from '../';
import config from '../config/env';
import Coupon from '../server/Coupon/CouponModel';

const dbUri = 'mongodb://root:root@ds015953.mlab.com:15953/shopping-cart';
const clearDb = require('mocha-mongoose')(dbUri);
const request = supertest;

function generateCode() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let text = '';

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

describe('Coupon API', () => {
  before(function (done) {
    if (mongoose.connection.db) return done();
    Promise.promisifyAll(mongoose);

    mongoose.connect(dbUri, done);
  });

  it('should generate 5 random coupons', function (done) {
    const coupon = new Coupon();
    const coupons = [];

    for (let i = 0; i < 5; i++) {
      coupons.push({
        name: faker.commerce.product(),
        description: faker.lorem.words(),
        price: faker.commerce.price(),
        code: generateCode(),
        createdAt: new Date(),
      });
    }

    coupon.collection.insert(coupons, (err, raw) => {
      raw.should.be.an.instanceOf(Object);
      raw.result.should.be.an.instanceOf(Object);
      raw.result.n.should.be.equal(5);

      done();
    });
  });

  it('should lists all coupons', function (done) {
    const coupon = new Coupon();
    const coupons = [];

    for (let i = 0; i < 5; i++) {
      coupons.push({
        name: faker.commerce.product(),
        description: faker.lorem.words(),
        price: faker.commerce.price(),
        code: generateCode(),
        createdAt: new Date(),
      });
    }

    coupon.collection.insert(coupons, (err, raw) => {
      Coupon.find({}, (err, coupons) => {
        coupons.should.be.not.empty();
        coupons.should.be.an.instanceOf(Object);

        done();
      });
    });
  });

  it('should delete a coupon', function (done) {
    const coupon = new Coupon({
      name: 'Gloves',
      description: 'pariatur dolor quo',
      price: 856,
      code: 'XYNCT',
      createdAt: new Date(),
    });

    coupon.saveAsync()
          .then((saveCoupon) => {
            Coupon.findByIdAndRemove(saveCoupon._id, (err, res) => {
              (err === null).should.be.true;
              res._id.should.be.an.instanceOf(Object);

              done();
            });
          });
  });

  it('should create a coupon', function (done) {
    const coupon = new Coupon({
      name: 'Gloves',
      description: 'pariatur dolor quo',
      price: 856,
      code: 'XYNCT',
      createdAt: new Date(),
    });

    coupon.saveAsync()
            .then((saveCoupon) => {
              saveCoupon.should.be.an.instanceOf(Object);
              saveCoupon.name.should.equal(coupon.name);
              saveCoupon.price.should.equal(coupon.price);
              saveCoupon.description.should.equal(coupon.description);
              saveCoupon.code.should.equal(coupon.code);
              done();
            });
  });


  it('should retrieve single coupon data', function (done) {
    const coupon = new Coupon({
      name: 'Gloves',
      description: 'pariatur dolor quo',
      price: 856,
      code: 'XYNCT',
      createdAt: new Date(),
    });

    coupon.saveAsync()
            .then(function (saveCoupon) {
              saveCoupon.should.be.an.instanceOf(Object);
              saveCoupon.name.should.equal(coupon.name);
              saveCoupon.price.should.equal(coupon.price);
              saveCoupon.description.should.equal(coupon.description);
              saveCoupon.code.should.equal(coupon.code);
              return saveCoupon;
            })
            .then((saveCoupon) => {
              Coupon.findById(saveCoupon._id.toString(), (err, retrievedCoupon) => {
                (err === null).should.be.true;

                retrievedCoupon.should.be.an.instanceOf(Object);
                retrievedCoupon.name.should.equal(saveCoupon.name);
                retrievedCoupon.price.should.equal(saveCoupon.price);
                retrievedCoupon.description.should.equal(saveCoupon.description);
                retrievedCoupon.code.should.equal(saveCoupon.code);

                done();
              });
            });
  });
});
