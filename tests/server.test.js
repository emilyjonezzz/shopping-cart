/*eslint-disable*/

import supertest from 'supertest';
import mongoose from 'mongoose';
import should from 'should';
import app from '../';

const request = supertest;

describe('Connection', function () {

  it('should show a "Welcome to shopping-cart API" message', function (done) {
    request(app)
    .get('/')
    .expect(200)
    .expect('Welcome to shopping-cart API', done);
  });

  it('should show client page', function (done) {
    request(app)
    .get('/client')
    .expect('Content-Type', 'text/html; charset=UTF-8', done);
  });

  describe('Product routes', function () {
    it('should show all product lists', function (done) {
      request(app)
      .get('/api/product/list')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end(function (err, res) {
        if (err) return done(err);

        done();
      });
    });

    it('should generate product', function (done) {
      request(app)
      .post('/api/product/generate')
      .expect(200, done);
    });

    it('get product should return error if missing id', function (done) {
      request(app)
      .get('/api/product/get')
      .expect(400)
      .expect('Missing id', done);
    });

    it('delete product should return error if missing id', function (done) {
      request(app)
      .delete('/api/product/delete')
      .expect(400)
      .expect('Missing id', done);
    });
  });
});
