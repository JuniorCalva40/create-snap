import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT;

app.get('/', (_req, res) => {
  res.send('Hello from Server Express :)');
});

const server = app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});

export { app, server };
