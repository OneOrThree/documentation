import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Keep the fixture beside the project so fast-xml-parser resolves normally.
function fixture(t, svg) {
  const dir = mkdtempSync(path.join(import.meta.dirname, '.diagram-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(path.join(dir, 'scripts'));
  mkdirSync(path.join(dir, 'diagrams'));
  copyFileSync(path.join(import.meta.dirname, 'build-diagrams.mjs'), path.join(dir, 'scripts/build-diagrams.mjs'));
  writeFileSync(path.join(dir, 'diagrams/manifest.json'), JSON.stringify([{id: 'test', title: '테스트'}]));
  writeFileSync(path.join(dir, 'diagrams/test.drawio.xml'), `<mxGraphModel><root>
    <mxCell id="0"/><mxCell id="1" parent="0"/>
    <mxCell id="background" vertex="1" connectable="0" parent="1"/>
    <mxCell id="actor" value="사용자" vertex="1" parent="1"/>
    <mxCell id="group" value="계정 · 온보딩" vertex="1" parent="1"/>
    <mxCell id="label" value="로그인" vertex="1" connectable="0" parent="group"/>
    <mxCell id="edge" edge="1" source="actor" target="label" parent="1"/>
  </root></mxGraphModel>`);
  writeFileSync(path.join(dir, 'diagrams/test.svg'), svg);
  return {dir, run: () => execFileSync(process.execPath, [path.join(dir, 'scripts/build-diagrams.mjs')], {encoding: 'utf8', stdio: 'pipe'})};
}
const svg = '<svg width="400" height="200"><g data-cell-id="background"/><g data-cell-id="actor"/><g data-cell-id="group"/><g data-cell-id="label"/><g data-cell-id="edge"/></svg>';

test('group artwork selects its owner; decoration is excluded and member edges resolve to the group', t => {
  const f = fixture(t, svg); f.run();
  const graph = JSON.parse(readFileSync(path.join(f.dir, 'public/diagrams/test.graph.json')));
  assert.deepEqual(graph.nodes, [{id:'actor',label:'사용자'},{id:'group',label:'계정 · 온보딩'}]);
  assert.deepEqual(graph.adjacency.actor, {nodes:['group'],edges:['edge']});
  const result = readFileSync(path.join(f.dir, 'public/diagrams/test.svg'), 'utf8');
  assert.match(result, /data-cell-id="group" data-drawio-cell-id="label" data-cell-kind="vertex" tabindex="-1" role="presentation"/);
  assert.match(result, /data-cell-id="group" data-drawio-cell-id="group" data-cell-kind="vertex" tabindex="0" role="button"/);
  assert.match(result, /<g data-cell-id="background"\/>/);
});

for (const missing of ['actor','edge']) {
  test(`missing SVG ${missing} fails the build instead of silently breaking clicks`, t => {
    const f = fixture(t, svg.replace(`<g data-cell-id="${missing}"/>`, ''));
    assert.throws(f.run, error => error.status === 1 && error.stderr.includes('incomplete XML join'));
  });
}
