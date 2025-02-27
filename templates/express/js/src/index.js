import express from 'express';

const app = express();
const PORT = process.env.PORT;

app.get('/', (_req, res) => {
  res.send('Hello from Express Js :)');
});

app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
