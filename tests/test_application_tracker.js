'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const files = process.argv.slice(2);
if (!files.length) files.push(require.resolve('../templates/application-tracker.html'));
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  new vm.Script(script);
  const archive = script.slice(script.indexOf('      function applyAutoArchive('), script.indexOf('      function dwellBadge('));
  const stats = script.slice(script.indexOf('      function updateStats('), script.indexOf('      function openModal('));
  const nodes = new Map();
  let saved;
  const context = {
    Date, ARCHIVE_DAYS: 10, STORAGE_KEY: 'test',
    daysInStatus: item => item.days,
    localStorage: { setItem: (key, value) => { saved = JSON.parse(value); } },
    today: () => '2026-11-13',
    $: key => { if (!nodes.has(key)) nodes.set(key, {}); return nodes.get(key); }
  };
  vm.createContext(context);
  vm.runInContext(archive + stats, context);
  const base = { status: 'Offer', days: 100, statusSince: '2026-10-23', updatedAt: '2026-11-11', note: 'Preserve evidence' };
  context.records = context.applyAutoArchive([
    { ...base, archived: true, archivedAt: '2026-11-10', archiveReason: '停留10工作日' },
    { ...base, archived: false },
    { status: '面试中', days: 10 },
    { status: '面试中', days: 9 },
    { status: '已结束', days: 0 },
    { status: '已结束', archived: true, archiveReason: '已结束' }
  ]);
  const restored = context.records[0];
  assert.equal(restored.archived, false);
  assert.equal(restored.archivedAt, '');
  assert.equal(restored.archiveReason, '');
  for (const key of Object.keys(base)) assert.equal(restored[key], base[key]);
  assert.equal(context.records[1].archived, false);
  assert.equal(context.records[2].archived, true);
  assert.equal(context.records[3].archived, undefined);
  assert.equal(context.records[4].archived, true);
  assert.equal(saved[0].archived, false);
  context.updateStats();
  assert.equal(nodes.get('#offerCount').textContent, 2);
  assert.equal(nodes.get('#archivedCount').textContent, 3);
  assert.equal(nodes.get('#activeCount').textContent, 1);
  assert.equal(nodes.has('#staleCount'), false);
  assert.doesNotMatch(html, /staleCount|待跟进/);
  assert.match(html, /repeat\(4, minmax\(0, 1fr\)\)/);
  saved = undefined;
  context.applyAutoArchive(context.records);
  assert.equal(saved, undefined);
  console.log(`Passed: Offer retention, archive recovery, counts and syntax (${file})`);
}
