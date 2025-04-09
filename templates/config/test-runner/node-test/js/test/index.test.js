import assert from 'node:assert';
import request from 'supertest';
import { it, describe } from 'node:test';
import { app } from '../src/index.js';

describe('Express Server', () => {
  it('should return "Hello from Express Js :)" on GET /', async () => {
    const res = await request(app).get('/');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.text, 'Hello from Express Js :)');
  });
});
