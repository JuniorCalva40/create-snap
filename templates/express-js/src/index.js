import express from 'express';
import 'dotenv/config';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Server');
});

app.listen(3000, () => {
  console.log(
    `Server started on port http://localhost:\x1b[34m${process.env.PORT}\x1b[0m`
  );
});
