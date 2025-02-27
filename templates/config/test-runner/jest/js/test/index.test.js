import request from 'supertest';
import { app, server } from '../src/index.js';

afterAll(() => {
  server.close();
});

describe('Express Server', () => {
  it('should return "Hello from Express Js :)" on GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello from Express Js :)');
  });
});
