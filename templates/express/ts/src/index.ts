import express, { Request, Response } from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT;

app.get('/', (request: Request, response: Response) => {
  response.status(200).send('Hello World from server Express-TS');
});

app
  .listen(PORT, () => {
    console.log('Server running at PORT : ', PORT);
  })
  .on('error', (error) => {
    throw new Error(error.message);
  });
