import express from 'express';
import bodyParser from 'body-parser';
import allRoutes from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to shopping-cart API');
});

app.use('/api', allRoutes);

export default app;
