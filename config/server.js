import express from 'express';
import bodyParser from 'body-parser';
import allRoutes from './routes';

const app = express();
const router = express.Router();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', allRoutes);

export default app;
