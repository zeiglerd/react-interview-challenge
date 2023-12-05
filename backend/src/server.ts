import express from 'express';
import dotenv from 'dotenv';
import { routes } from './routes';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);

const port: number = parseInt(process.env.SERVER_PORT || '3000');
const host: string = process.env.SERVER_HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`Running on http://${host}:${port}`);
});