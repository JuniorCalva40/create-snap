import request from 'supertest';
import { app } from '../src/index.js';
import { describe, it, expect } from 'vitest';

describe('Express Server', () => {
  it('should return "Hello from Express Js :)" on GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello from Express Js :)');
  });
});
