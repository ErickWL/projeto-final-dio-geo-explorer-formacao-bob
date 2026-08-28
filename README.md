# Geo-Explorer / DIO Explorer MCP

Projeto educacional que combina uma base de conhecimento em JSON, prompts reutilizaveis para o GitHub Copilot e um servidor MCP (Model Context Protocol) para consulta controlada do catalogo.

O catalogo e ficticio e serve para estudo. Ele nao representa ofertas, precos, eventos, certificados ou servicos oficiais da DIO.

## O que e o Geo-Explorer

O Geo-Explorer e o nome da experiencia educacional deste projeto: um explorador de trilhas de tecnologia que ajuda o estudante a escolher um caminho, praticar com desafios e registrar uma conclusao ficticia. A implementacao atual e chamada de DIO Explorer MCP porque o repositorio foi construido sobre esse catalogo demonstrativo.

Ele possui duas formas complementares de uso:

- **Comandos do Copilot:** prompts Markdown para estudar trilhas, gerar desafios e criar um certificado educacional.
- **Servidor MCP:** endpoint HTTP autenticado que permite a clientes MCP consultar o catalogo por meio da tool `buscar_trilhas`.

## O que foi construido

- Catalogo com 30 trilhas ficticias em `DIO_explorer/data/trilhas_dio.json`.
- Prompt `trilha` para consultar uma tecnologia e montar um plano por modulos.
- Prompt `desafio` para gerar um desafio de codigo validando tecnologia e nivel.
- Prompt `certificado` para gerar um certificado educacional ficticio.
- Desafio e certificado Java de exemplo em `DIO_explorer/docs/`.
- Servidor MCP HTTP em `mcp/`, com a tool `buscar_trilhas`.
- Testes automatizados para o catalogo, prompts, configuracao e controles de seguranca.

## Como executar o projeto

1. Instale Node.js 20 ou superior e npm.
2. Instale as dependencias na raiz:

```powershell
npm install
```

3. Configure as variaveis obrigatorias conforme [.env.example](.env.example). Para uma execucao local no PowerShell:

```powershell
$env:MCP_API_TOKEN = 'gere-um-token-local'
$env:MCP_SESSION_SECRET = 'gere-um-segredo-local'
$env:CORS_ORIGIN = 'http://localhost:3000'
$env:HTTPS_TERMINATION = 'reverse-proxy'
$env:PORT = '3000'
$env:NODE_ENV = 'development'
npm start
```

O servidor sera iniciado em `127.0.0.1:3000`. Em uma publicacao, o reverse proxy deve terminar o HTTPS antes de encaminhar trafego para o Node.js. Para carregar um arquivo `.env` localmente, use `node --env-file=.env mcp/server.mjs`; esse arquivo nao deve ser versionado.

## Como usar os comandos

Os comandos ficam em `.github/prompts/` e podem ser usados no GitHub Copilot Chat ou no ambiente que reconheca prompts do workspace.

### `/trilha`

Informe uma tecnologia do catalogo:

```text
/trilha Java
```

O prompt consulta o JSON, valida a tecnologia e retorna um plano de estudos por modulos, nivel, XP, badges, lives, projeto final e criterios de conclusao.

### `/desafio`

Informe tecnologia e nivel separados por virgula:

```text
/desafio Python, intermediario
```

Os niveis validos sao `iniciante`, `intermediario` e `avancado`. O resultado e um desafio ficticio com contexto, requisitos, exemplos, restricoes, avaliacao, dica, XP e tempo estimado, sem entregar a solucao completa.

### `/certificado`

Informe o nome do estudante e o nome exato da trilha:

```text
/certificado Erick Silva, Java e Spring Boot para APIs Corporativas
```

O resultado e um certificado Markdown ficticio, com tecnologias, nivel, modulos, XP, data e identificador. Ele sempre deve ser tratado como material educacional, nunca como certificado oficial ou comprovante profissional.

### Tool MCP `buscar_trilhas`

Clientes MCP devem chamar `POST /mcp` com `Authorization: Bearer <MCP_API_TOKEN>` em cada requisicao. O argumento opcional e:

```json
{
	"tecnologia": "Java"
}
```

Sem argumento, a tool retorna todas as trilhas. Payloads extras, tipos incorretos, strings vazias e caracteres nao permitidos sao rejeitados.

## Arquitetura resumida

```text
Cliente MCP
	|
	| HTTPS terminado no reverse proxy
	v
POST /mcp (Express)
	| Helmet, CORS, JSON limit, rate limit, Bearer token
	v
NodeStreamableHTTPServerTransport
	v
McpServer -> buscar_trilhas -> catalog.mjs
								|
								v
				 paths.mjs -> DIO_explorer/data/trilhas_dio.json
```

O servidor nao executa comandos do sistema, nao aceita caminhos fornecidos pelo cliente e nao escreve no catalogo. A leitura e feita somente depois da validacao de caminho.

## Requisitos

- Node.js 20 ou superior. Node 24 foi usado na validacao local.
- npm.
- Um reverse proxy com TLS para qualquer exposicao fora da maquina local.

## Instalacao

Na raiz do projeto:

```powershell
npm install
```

Os imports MCP usam a linha v2 do SDK oficial:

- `@modelcontextprotocol/server`: cria o servidor e registra tools.
- `@modelcontextprotocol/node`: fornece o transporte Streamable HTTP para Node.js.

## Configuracao por ambiente

Consulte [.env.example](.env.example). Nenhum segredo deve ser colocado no repositorio.

Variaveis obrigatorias:

| Variavel | Finalidade |
| --- | --- |
| `MCP_API_TOKEN` | Token Bearer exigido em cada chamada HTTP/MCP. |
| `MCP_SESSION_SECRET` | Segredo reservado para evolucao de sessoes/SSO; atualmente validado no boot. |
| `CORS_ORIGIN` | Origem exata permitida para clientes de navegador. |
| `HTTPS_TERMINATION` | Deve ser exatamente `reverse-proxy`. |

Variaveis opcionais:

| Variavel | Padrao | Finalidade |
| --- | --- | --- |
| `PORT` | `3000` | Porta local do processo. |
| `HOST` | `127.0.0.1` | Interface de escuta. |
| `NODE_ENV` | `development` | Ambiente de execucao. |

### PowerShell: uso local

Defina os valores apenas na sessao do terminal:

```powershell
$env:MCP_API_TOKEN = 'gere-um-token-local'
$env:MCP_SESSION_SECRET = 'gere-um-segredo-local'
$env:CORS_ORIGIN = 'http://localhost:3000'
$env:HTTPS_TERMINATION = 'reverse-proxy'
$env:PORT = '3000'
$env:NODE_ENV = 'development'
npm start
```

Tambem e possivel usar um arquivo local nao versionado com Node:

```powershell
node --env-file=.env mcp/server.mjs
```

Em producao, prefira o gerenciador de segredos da plataforma. A aplicacao falha no boot se uma variavel obrigatoria faltar, se a porta for invalida ou se a terminacao TLS nao estiver explicita.

## Modos de uso

### 1. Estudo local

Use o servidor em `127.0.0.1` para aprender o fluxo MCP sem publica-lo na rede. O cliente deve enviar o token em toda requisicao, inclusive inicializacao, listagem de tools e chamada de tool.

### 2. Integracao com cliente MCP

Configure o cliente para apontar para `https://seu-dominio.example/mcp` e enviar:

```http
Authorization: Bearer <MCP_API_TOKEN>
Content-Type: application/json
```

O reverse proxy deve terminar TLS, encaminhar somente trafego HTTPS e proteger o processo Node de acesso publico direto. O servidor exige `HTTPS_TERMINATION=reverse-proxy` justamente para tornar essa decisao visivel.

### 3. Futuras integracoes

SSO/OAuth, API gateway, observabilidade e politicas por usuario podem ser adicionados no reverse proxy ou em middleware dedicado. Nao substitua o token atual por uma confianca baseada apenas no handshake: a autenticacao deve continuar sendo executada em cada chamada MCP.

## Tool disponivel

### `buscar_trilhas`

Busca trilhas por tecnologia. O parametro e opcional:

```json
{
  "tecnologia": "Java"
}
```

Sem parametro, retorna todas as trilhas. O payload precisa ser um objeto estrito; `tecnologia` deve ser texto entre 1 e 80 caracteres e aceita apenas caracteres alfanumericos, espacos e pontuacao controlada. Exemplos de entradas invalidas sao objetos com campos extras, scripts, strings vazias ou tipos diferentes de texto.

## Seguranca aplicada

- **Diretorios protegidos:** somente `mcp` e `DIO_explorer/data` sao bases conhecidas para acesso. O servidor nao abre caminhos arbitrarios.
- **Traversal e symlinks:** `mcp/paths.mjs` usa `path.resolve()` e `fs.realpathSync()` e compara o resultado com a base absoluta antes do `readFile`.
- **Segredos:** tokens, segredo de sessao, origem CORS e decisao de TLS vem exclusivamente de variaveis de ambiente.
- **Autenticacao por chamada:** `/mcp` valida `Authorization: Bearer ...` antes de entregar a requisicao ao transporte MCP.
- **Schema e sanitizacao:** Zod valida estrutura, tipo, tamanho e caracteres do payload.
- **Headers:** Helmet adiciona headers HTTP de seguranca e `x-powered-by` e desabilitado.
- **CORS:** a origem vem de `CORS_ORIGIN`; nao existe fallback para `*`, e wildcard e rejeitado em producao.
- **Rate limiting:** o endpoint HTTP aceita no maximo 60 requisicoes por IP a cada minuto.
- **Erros:** o cliente recebe apenas `Unauthorized` ou `Internal server error`; stack traces e caminhos absolutos ficam somente no log do servidor.
- **TLS:** a terminacao ocorre explicitamente no reverse proxy, nao dentro do processo Node.

Essas medidas reduzem riscos, mas nao substituem revisao de infraestrutura, rotacao de segredos, atualizacao de dependencias, logs protegidos, backup e testes de penetracao antes de uma publicacao real.

## Como executar os testes

Execute todos os testes:

```powershell
npm test
```

Os testes verificam:

- presenca da trilha Java e integridade do catalogo;
- regras dos tres prompts;
- existencia e conteudo dos artefatos educacionais;
- falha de boot sem variaveis obrigatorias;
- rejeicao de terminacao TLS ambigua;
- bloqueio de Directory Traversal e caminhos inexistentes;
- validacao de payload e consulta da tool.

## Melhorias realizadas

- Organizacao do servidor em modulos de configuracao, autenticacao, paths, catalogo e transporte.
- Migracao para o SDK MCP v2 usando `@modelcontextprotocol/server` e `@modelcontextprotocol/node`.
- Restricao de leitura ao JSON autorizado, com `path.resolve()` e `fs.realpathSync()` contra traversal e symlinks.
- Autenticacao por Bearer token aplicada a cada chamada HTTP/MCP.
- Validacao estrita de schemas e sanitizacao dos parametros com Zod.
- CORS configuravel sem wildcard automatico, Helmet, limite de corpo JSON e rate limiting.
- Tratamento de erros sem stack trace ou caminhos internos nas respostas.
- Decisao de HTTPS documentada e validada: terminacao no reverse proxy.
- Testes automatizados para seguranca, configuracao, catalogo, prompts e artefatos.
- README ampliado com instalacao, operacao, limites e orientacao de aprendizagem.

## Mapa de arquivos

| Caminho | Responsabilidade |
| --- | --- |
| `mcp/server.mjs` | Cria o MCP, configura Express e inicia o HTTP server. |
| `mcp/config.mjs` | Valida e congela a configuracao de ambiente. |
| `mcp/auth.mjs` | Compara o Bearer token com igualdade em tempo constante. |
| `mcp/paths.mjs` | Resolve bases protegidas e elimina escapes por traversal/symlink. |
| `mcp/catalog.mjs` | Valida consultas e le o JSON permitido. |
| `.github/prompts/` | Prompts educacionais `trilha`, `desafio` e `certificado`. |
| `DIO_explorer/data/` | Fonte de dados ficticia. |
| `DIO_explorer/docs/` | Artefatos gerados para estudo. |
| `tests/` | Testes do projeto e do servidor MCP. |
| `.env.example` | Modelo sem credenciais reais. |

## Fluxo de aprendizagem sugerido

1. Leia o JSON e descreva o formato de uma trilha.
2. Execute os testes e altere um dado ficticio para observar uma falha controlada.
3. Leia os prompts e compare entrada, validacao e resultado esperado.
4. Estude `catalog.mjs` antes de estudar `server.mjs`; primeiro entenda a regra de negocio, depois o transporte.
5. Teste entradas validas e invalidas sem remover as barreiras de seguranca.
6. Desenhe como adicionar uma nova tool mantendo schema, autenticacao e limites.
7. Simule uma publicacao atras de reverse proxy e documente quem termina TLS, quem autentica e quem registra logs.

## O que foi aprendido durante o desafio

- Um servidor funcional precisa de contratos claros entre entrada, validacao, regra de negocio e transporte.
- A seguranca deve acontecer antes do acesso ao recurso: primeiro resolve e autoriza o path, depois le o arquivo.
- Variaveis obrigatorias e falha no boot tornam erros de configuracao visiveis antes de atender usuarios.
- MCP padroniza a comunicacao, mas nao substitui autenticacao, CORS, headers, rate limiting ou logs seguros.
- Testes de seguranca sao praticos: tentar traversal, payload invalido e ambiente incompleto revela regressao rapidamente.
- Documentar a terminacao TLS evita que uma aplicacao seja publicada com uma arquitetura de rede presumida.
- Separar camadas torna futuras evolucoes, como SSO, OAuth e autorizacao por escopo, mais simples de testar.

## Insights para futuros profissionais

- **Seguranca e uma propriedade do fluxo inteiro.** Validar o parametro depois de abrir o arquivo ja e tarde; o caminho precisa ser autorizado antes do acesso.
- **Configuracao tambem e codigo.** Falhar cedo por ambiente incompleto e melhor do que iniciar um servico parcialmente seguro.
- **Protocolos nao eliminam controles tradicionais.** MCP ainda precisa de autenticacao, autorizacao, rate limiting, CORS, headers e tratamento de erros.
- **Schemas sao contratos vivos.** Zod documenta o formato aceito e impede que a camada de negocio receba dados inesperados.
- **Logs e respostas tem publicos diferentes.** O servidor precisa de contexto para diagnosticar; o cliente precisa de mensagens seguras e estaveis.
- **Documentacao reduz risco operacional.** Uma decisao explicita de TLS, uma lista de env vars e um comando reproduzivel evitam configuracoes improvisadas.
- **Projetos pequenos ensinam arquitetura.** Separar configuracao, autenticacao, paths, dominio e transporte torna mudancas futuras, como SSO, testaveis e localizadas.
- **Portfolio responsavel distingue ficcao de realidade.** Os certificados e trilhas deste repositorio sao demonstrativos e devem ser apresentados como tal.

## Limites atuais e proximos passos

O projeto ainda usa um token compartilhado, armazenamento de sessao em memoria do transporte e um unico processo Node. Antes de uso publico, os proximos trabalhos naturais sao:

- integrar OAuth 2.1/SSO com autorizacao por identidade e escopo;
- usar armazenamento compartilhado se houver varias replicas;
- adicionar telemetria sem registrar tokens ou payloads sensiveis;
- configurar health checks, shutdown gracioso e timeouts do proxy;
- adicionar testes de contrato MCP e testes de carga;
- fixar e atualizar dependencias com revisao de seguranca.

## Licenca e carater educacional

Este material foi organizado para aprendizado. Os dados, certificados e referencias a trilhas sao ficticios; nao devem ser usados como comprovacao de conclusao, oferta comercial ou vinculo oficial.
