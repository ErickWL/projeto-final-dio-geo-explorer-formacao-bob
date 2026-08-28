import crypto from 'node:crypto';
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import process from 'node:process';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { McpServer } from '@modelcontextprotocol/server';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';
import { z } from 'zod';
import { authenticateRequest } from './auth.mjs';
import { loadConfig } from './config.mjs';
import { findTrails } from './catalog.mjs';

export function createMcpServer() {
  const server = new McpServer({ name: 'dio-explorer-catalog', version: '1.0.0' });
  server.registerTool(
    'buscar_trilhas',
    {
      description: 'Busca trilhas no catalogo educacional local.',
      inputSchema: z.object({
        tecnologia: z.string().trim().min(1).max(80).regex(/^[\p{L}\p{N} .+#.-]+$/u).optional(),
      }).strict(),
    },
    async (input) => ({
      content: [{ type: 'text', text: JSON.stringify(await findTrails(input)) }],
    }),
  );
  return server;
}

export function createApp(config, transport) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', false);
  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin, methods: ['GET', 'POST', 'DELETE'], allowedHeaders: ['Authorization', 'Content-Type', 'Mcp-Session-Id', 'MCP-Protocol-Version'] }));
  app.use(express.json({ limit: '32kb', strict: true }));
  app.use(rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.use('/mcp', authenticateRequest(config.apiToken));
  app.all('/mcp', async (req, res, next) => {
    try {
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      next(error);
    }
  });
  app.use((error, req, res, next) => {
    console.error('HTTP request failed', error);
    if (res.headersSent) return next(error);
    return res.status(error.statusCode ?? 500).json({ error: 'Internal server error' });
  });
  return app;
}

export async function start(config = loadConfig()) {
  const mcp = createMcpServer();
  const transport = new NodeStreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() });
  await mcp.connect(transport);
  const app = createApp(config, transport);
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(config.port, config.host, resolve));
  console.error(`MCP server listening on ${config.host}:${config.port}; TLS termination: ${config.httpsTermination}`);
  return { server, transport, mcp };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  start().catch((error) => {
    console.error('MCP server failed to start', error);
    process.exitCode = 1;
  });
}
