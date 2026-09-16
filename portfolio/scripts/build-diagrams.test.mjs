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
  writeFileSync(path.join(dir, 'diagrams/manifest.json'), JSON.stringify([{
    id: 'test',
    title: '테스트',
    versions: [{id: 'v1', artifactId: 'test'}],
  }]));
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

test('a host includes its services while their individual traffic links remain selectable', t => {
  const f = fixture(t, svg.replace('</svg>', '<g data-cell-id="nginx"/><g data-cell-id="app"/><g data-cell-id="internal"/></svg>'));
  const xmlPath = path.join(f.dir, 'diagrams/test.drawio.xml');
  writeFileSync(xmlPath, readFileSync(xmlPath, 'utf8').replace('</root>', `
    <mxCell id="nginx" value="Nginx" vertex="1" parent="group"/>
    <mxCell id="app" value="Spring Boot" vertex="1" parent="group"/>
    <mxCell id="internal" edge="1" source="nginx" target="app" parent="1"/>
  </root>`));
  f.run();
  const graph = JSON.parse(readFileSync(path.join(f.dir, 'public/diagrams/test.graph.json')));
  assert.deepEqual(graph.groups.group, ['nginx', 'app']);
  assert.deepEqual(graph.adjacency.nginx, {nodes:['app'],edges:['internal']});
  assert.deepEqual(graph.adjacency.group, {nodes:['actor'],edges:['edge']});
});

test('HTML diagrams copy every version artifact and preserve version metadata', t => {
  const dir = mkdtempSync(path.join(import.meta.dirname, '.diagram-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(path.join(dir, 'scripts'));
  mkdirSync(path.join(dir, 'diagrams'));
  copyFileSync(
    path.join(import.meta.dirname, 'build-diagrams.mjs'),
    path.join(dir, 'scripts/build-diagrams.mjs'),
  );
  writeFileSync(
    path.join(dir, 'diagrams/manifest.json'),
    JSON.stringify([{
      id: 'journey',
      title: '유저 저니',
      format: 'html',
      versions: [
        {id: 'v2', artifactId: 'journey', label: 'v2 · 현재'},
        {id: 'v1', artifactId: 'journey.v1', label: 'v1 · 이전'},
      ],
    }]),
  );
  writeFileSync(path.join(dir, 'diagrams/journey.html'), '<h1>v2</h1>');
  writeFileSync(path.join(dir, 'diagrams/journey.v1.html'), '<h1>v1</h1>');

  execFileSync(process.execPath, [path.join(dir, 'scripts/build-diagrams.mjs')]);

  assert.equal(
    readFileSync(path.join(dir, 'public/diagrams/journey.html'), 'utf8'),
    '<h1>v2</h1>',
  );
  assert.equal(
    readFileSync(path.join(dir, 'public/diagrams/journey.v1.html'), 'utf8'),
    '<h1>v1</h1>',
  );
  const index = JSON.parse(
    readFileSync(path.join(dir, 'public/diagrams/index.json'), 'utf8'),
  );
  assert.deepEqual(index[0].versions.map(({id, artifactId}) => ({id, artifactId})), [
    {id: 'v2', artifactId: 'journey'},
    {id: 'v1', artifactId: 'journey.v1'},
  ]);
});

test('an unversioned diagram fails the build', t => {
  const f = fixture(t, svg);
  writeFileSync(
    path.join(f.dir, 'diagrams/manifest.json'),
    JSON.stringify([{id: 'test', title: '테스트'}]),
  );
  assert.throws(
    f.run,
    error => error.status === 1 && error.stderr.includes('every diagram needs at least one version'),
  );
});

for (const [name, versions, message] of [
  [
    'a current version pointing at a historical artifact',
    [{id: 'v2', artifactId: 'test.v2'}, {id: 'v1', artifactId: 'test.v1'}],
    'current version must use artifactId',
  ],
  [
    'a historical version reusing the current alias',
    [{id: 'v2', artifactId: 'test'}, {id: 'v1', artifactId: 'test'}],
    'version ids and artifact ids must be unique',
  ],
  [
    'versions listed oldest first',
    [{id: 'v1', artifactId: 'test'}, {id: 'v2', artifactId: 'test.v2'}],
    'versions must be newest first',
  ],
]) {
  test(`${name} fails the build`, t => {
    const f = fixture(t, svg);
    writeFileSync(
      path.join(f.dir, 'diagrams/manifest.json'),
      JSON.stringify([{id: 'test', title: '테스트', versions}]),
    );
    assert.throws(
      f.run,
      error => error.status === 1 && error.stderr.includes(message),
    );
  });
}

test('current diagrams share the system architecture visual contract', () => {
  const diagramDir = path.join(import.meta.dirname, '..', 'diagrams');
  for (const id of ['00-usecase', '03-service', '04-system', '05-cloud']) {
    const svgSource = readFileSync(path.join(diagramDir, `${id}.svg`), 'utf8').toLowerCase();
    for (const token of ['#ffffff', '#172b3a', '#4d5a66', '#f8fafc', '#dce4eb']) {
      assert.ok(svgSource.includes(token), `${id}.svg is missing ${token}`);
    }
    assert.ok(
      svgSource.includes('apple sd gothic neo, noto sans kr, sans-serif'),
      `${id}.svg uses a different font stack`,
    );
  }
  // 01-ia·02-journey는 v4부터 설계 쪽 R61 원본(scripts/sync-r61-html.py)을 그대로 쓰므로
  // 04-system 토큰을 요구하지 않는다. v3까지의 생성본은 diagrams/<id>.v3.html에 보존돼 있다.
});
