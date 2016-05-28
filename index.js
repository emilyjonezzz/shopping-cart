import express from 'express';
import Promise from 'bluebird';
import mongoose from 'mongoose';
import app from './config/server';
import config from './config/env';

Promise.promisifyAll(mongoose);

mongoose.connect('mongodb://root:root@ds015953.mlab.com:15953/shopping-cart');
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.default.db}`);
});

app.use('/client', express.static(`${__dirname} /client`));

app.listen(config.default.port, () => {
  console.log(`Begin the magic at port ${config.default.port}`);
});

export default app;
