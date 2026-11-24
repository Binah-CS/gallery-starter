import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startTestApp } from './helpers.ts';

const allGalleries = 'SELECT id, owner_id, name, status FROM galleries ORDER BY id';

test('001 AC-2: dana receives exactly her own galleries', async () => {
  const app = await startTestApp();
  try {
    const before = app.rows(allGalleries);
    const res = await app.call('GET', '/api/galleries', { user: 'dana' });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.map((g: { name: string }) => g.name), ['Levi wedding', 'Cohen bar mitzvah']);
    assert.deepEqual(app.rows(allGalleries), before, 'listing must not change stored data');
  } finally {
    await app.close();
  }
});

test('001 AC-3: a request with no identity is rejected and returns no galleries', async () => {
  const app = await startTestApp();
  try {
    const res = await app.call('GET', '/api/galleries');
    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { error: 'IDENTITY_MISSING' });
  } finally {
    await app.close();
  }
});

test('001 AC-4: an unknown identity is rejected and returns no galleries', async () => {
  const app = await startTestApp();
  try {
    const res = await app.call('GET', '/api/galleries', { user: 'rina' });
    assert.equal(res.status, 401);
    assert.deepEqual(res.body, { error: 'IDENTITY_UNKNOWN' });
    assert.equal(app.rows("SELECT id FROM photographers WHERE id = 'rina'").length, 0, 'no user is created');
  } finally {
    await app.close();
  }
});

test('001 AC-5: data survives a restart and is seeded only once', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gallery-'));
  const path = join(dir, 'app.db');
  try {
    const first = await startTestApp(path);
    await first.close();
    const second = await startTestApp(path);
    try {
      const res = await second.call('GET', '/api/galleries', { user: 'dana' });
      assert.equal(res.body.length, 2);
      assert.equal(second.rows('SELECT id FROM galleries').length, 3, 'no duplicate seed rows');
    } finally {
      await second.close();
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('001 AC-1: the response shape is the contract, and never exposes other owners', async () => {
  const app = await startTestApp();
  try {
    const res = await app.call('GET', '/api/galleries', { user: 'noa' });
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, [
      { id: 3, name: 'Tel Aviv portraits', status: 'draft', createdAt: '2026-11-04T09:00:00.000Z', publishedAt: null },
    ]);
  } finally {
    await app.close();
  }
});
