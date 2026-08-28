import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const catalogPath = new URL('DIO_explorer/data/trilhas_dio.json', root);
const promptPaths = {
  trilha: new URL('.github/prompts/trilha.prompt.md', root),
  desafio: new URL('.github/prompts/desafio.prompt.md', root),
  certificado: new URL('.github/prompts/certificado.prompt.md', root),
};
const artifactPaths = {
  desafio: new URL('DIO_explorer/docs/desafio-java.md', root),
  certificado: new URL('DIO_explorer/docs/certificado-java.md', root),
};

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const prompts = Object.fromEntries(
  await Promise.all(
    Object.entries(promptPaths).map(async ([name, path]) => [name, await readFile(path, 'utf8')]),
  ),
);

function normalized(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

test('catalogo contem a trilha Java', () => {
  const javaTrail = catalog.trilhas.find((trail) =>
    trail.tecnologia.some((technology) => normalized(technology) === 'java'),
  );

  assert.ok(javaTrail);
  assert.equal(javaTrail.nome, 'Java e Spring Boot para APIs Corporativas');
  assert.equal(javaTrail.nivel, 'intermediario');
  assert.equal(javaTrail.numero_modulos, 14);
  assert.equal(javaTrail.xp_total, 5100);
});

test('comando trilha aceita tecnologia e pede plano por modulos', () => {
  assert.match(prompts.trilha, /name: trilha/);
  assert.match(prompts.trilha, /\$\{input:tecnologia\}/);
  assert.match(prompts.trilha, /DIO_explorer\/data\/trilhas_dio\.json/);
  assert.match(prompts.trilha, /roteiro numerado para cada modulo/);
});

test('comando desafio valida tecnologia e nivel', () => {
  assert.match(prompts.desafio, /name: desafio/);
  assert.match(prompts.desafio, /\$\{input:tecnologia_e_nivel\}/);
  assert.match(prompts.desafio, /tecnologia presente na lista/);
  assert.match(prompts.desafio, /aleatorio e inedito/);
  assert.match(prompts.desafio, /Pelo menos dois exemplos/);
});

test('comando certificado valida trilha e identifica o aluno', () => {
  assert.match(prompts.certificado, /name: certificado/);
  assert.match(prompts.certificado, /\$\{input:nome_e_trilha\}/);
  assert.match(prompts.certificado, /Nome completo do usuario/);
  assert.match(prompts.certificado, /ficticio/);
});

test('arquivo de desafio Java foi gerado para o aluno', async () => {
  const challenge = await readFile(artifactPaths.desafio, 'utf8');

  assert.match(challenge, /Desafio de Codigo: Fila de Atendimento/);
  assert.match(challenge, /\*\*Aluno:\*\* Erick Silva/);
  assert.match(challenge, /\*\*Tecnologia:\*\* Java/);
  assert.match(challenge, /\*\*Nivel:\*\* intermediario/);
  assert.match(challenge, /Exemplo 1/);
  assert.match(challenge, /Exemplo 2/);
});

test('arquivo de certificado Java foi gerado para o mesmo aluno', async () => {
  const certificate = await readFile(artifactPaths.certificado, 'utf8');

  assert.match(certificate, /Certificado de Conclusao/);
  assert.match(certificate, /Erick Silva/);
  assert.match(certificate, /Java e Spring Boot para APIs Corporativas/);
  assert.match(certificate, /DIO-FICT-2026-JAVA/);
  assert.match(certificate, /nao representa um certificado oficial da DIO/);
});
