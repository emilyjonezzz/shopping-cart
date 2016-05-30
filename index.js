import Promise from 'bluebird';
import mongoose from 'mongoose';
import app from './config/server';
import config from './config/env';

if (!module.parent) {
  Promise.promisifyAll(mongoose);

  mongoose.connect(config.default.db);
  mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.default.db}`);
  });

  app.listen(config.default.port, () => {
    console.log(`Begin the magic at port ${config.default.port}`);
  });
}

export default app;
