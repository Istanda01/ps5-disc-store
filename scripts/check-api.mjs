import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';

// ตรวจ JSON Server จริงโดยใช้พอร์ตแยก ไม่ต้องเปิดหน้าเว็บ
const server = spawn(process.execPath, ['node_modules/json-server/lib/cli/bin.js', '--watch', 'db.json', '--host', '127.0.0.1', '--port', '3008', '--read-only'], { stdio: 'ignore' });
const base = 'http://127.0.0.1:3008';
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(`${base}/games`)).ok) { ready = true; break; } } catch {}
    await delay(150);
  }
  assert.ok(ready, 'JSON Server did not start');
  const response = await fetch(`${base}/games`);
  const games = await response.json();
  assert.equal(games.length, 20);
  const detail = await (await fetch(`${base}/games/2`)).json();
  assert.equal(detail.id, '2');
  assert.equal(detail.title, games[1].title);
  assert.equal((await fetch(`${base}/games/missing`)).status, 404);
  const write = await fetch(`${base}/games`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  assert.ok(!write.ok, 'Read-only API must reject writes');
  console.log('JSON Server passed: 20 records, correct detail, 404, read-only mode.');
} finally {
  server.kill();
}
