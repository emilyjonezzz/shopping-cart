/*eslint-disable*/

import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../';

const request = supertest;

describe('Connection', () => {

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
});
