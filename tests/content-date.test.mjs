import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidContentDate } from '../src/lib/content-date.ts';

test('content dates reject invalid calendar dates and ambiguous formats', () => {
  assert.equal(isValidContentDate('2024-02-29'), true);
  for (const value of ['2026-02-29', '2026-02-30', '2026-13-01', '2026-1-01', '10/10/2026', null]) {
    assert.equal(isValidContentDate(value), false, String(value));
  }
});

test('an article cannot be modified before its publication date', () => {
  assert.equal(isValidContentDate('2026-10-08', '2026-10-09'), false);
  assert.equal(isValidContentDate('2026-10-09', '2026-10-09'), true);
  assert.equal(isValidContentDate('2026-10-10', '2026-10-09'), true);
});
