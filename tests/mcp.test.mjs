import assert from 'node:assert/strict';
import test from 'node:test';
import { loadConfig } from '../mcp/config.mjs';
import { safePath } from '../mcp/paths.mjs';
import { findTrails } from '../mcp/catalog.mjs';

test('configuracao falha sem segredos obrigatorios', () => {
  assert.throws(() => loadConfig({}), /MCP_API_TOKEN/);
});

test('configuracao rejeita terminacao TLS ambigua', () => {
  assert.throws(() => loadConfig({ MCP_API_TOKEN: 'a', MCP_SESSION_SECRET: 'b', CORS_ORIGIN: 'https://client.invalid', HTTPS_TERMINATION: 'local' }), /reverse-proxy/);
});

test('path traversal nao sai da pasta data', () => {
  assert.throws(() => safePath('data', '../docs/desafio-java.md'), /Path escapes protected directory/);
});

test('symlink ou caminho inexistente nao e aceito', () => {
  assert.throws(() => safePath('data', 'missing.json'), /Protected path/);
});

test('payload de busca e validado e catalogo e consultado', async () => {
  const trails = await findTrails({ tecnologia: 'Java' });
  assert.equal(trails.length, 1);
  await assert.rejects(() => findTrails({ tecnologia: '<script>' }), /Invalid string/);
});
