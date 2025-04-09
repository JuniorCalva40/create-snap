import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'fs-extra';
import { createApp } from '../src/utils/createApp';
import { confirm } from '@clack/prompts';
import test from 'node:test';

describe('createApp function', () => {
  test('test log', async () => {
    expect(true).toBe(true);
  });
});
