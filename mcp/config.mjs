import process from 'node:process';

const required = ['MCP_API_TOKEN', 'MCP_SESSION_SECRET', 'CORS_ORIGIN', 'HTTPS_TERMINATION'];

export function loadConfig(env = process.env) {
  const missing = required.filter((name) => !env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (env.HTTPS_TERMINATION !== 'reverse-proxy') {
    throw new Error('HTTPS_TERMINATION must be reverse-proxy');
  }

  if (env.NODE_ENV === 'production' && env.CORS_ORIGIN === '*') {
    throw new Error('CORS_ORIGIN cannot be wildcard in production');
  }

  const port = Number(env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return Object.freeze({
    apiToken: env.MCP_API_TOKEN,
    sessionSecret: env.MCP_SESSION_SECRET,
    corsOrigin: env.CORS_ORIGIN,
    httpsTermination: env.HTTPS_TERMINATION,
    host: env.HOST ?? '127.0.0.1',
    port,
    nodeEnv: env.NODE_ENV ?? 'development',
  });
}
