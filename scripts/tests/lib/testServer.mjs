import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = fileURLToPath(new URL('../../../', import.meta.url));
const DEFAULT_STARTUP_TIMEOUT_MS = 25000;

export async function startTestServer(options = {}) {
  const port = options.port ?? 4050;
  const startupTimeoutMs = options.startupTimeoutMs ?? DEFAULT_STARTUP_TIMEOUT_MS;
  const envOverrides = options.env ?? {};

  const logs = [];
  const pushLog = (stream, line) => {
    const text = `[${stream}] ${line}`;
    logs.push(text);
    if (logs.length > 150) {
      logs.shift();
    }
  };

  const child = spawn(process.execPath, ['server/index.js'], {
    cwd: ROOT_DIR,
    env: {
      ...process.env,
      NODE_ENV: 'test',
      API_PORT: String(port),
      JWT_SECRET: 'test-secret',
      MONGODB_MODE: 'auto',
      MONGODB_FALLBACK_MODE: 'off',
      INSURER_EMAIL: 'insurer@shieldride.ai',
      INSURER_PASSWORD: 'Insurer@123',
      API_JSON_LIMIT: '10mb',
      API_URLENCODED_LIMIT: '10mb',
      ...envOverrides,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => {
    chunk
      .toString()
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((line) => pushLog('stdout', line));
  });

  child.stderr.on('data', (chunk) => {
    chunk
      .toString()
      .split(/\r?\n/)
      .filter(Boolean)
      .forEach((line) => pushLog('stderr', line));
  });

  await waitForHealth(`http://127.0.0.1:${port}`, startupTimeoutMs, child, logs);

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    logs,
    async stop() {
      await stopChild(child);
    },
  };
}

async function waitForHealth(baseUrl, timeoutMs, child, logs) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (child.exitCode !== null) {
      break;
    }

    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) {
        return;
      }
    } catch {
      // retry
    }

    await delay(250);
  }

  const tail = logs.slice(-25).join('\n');
  throw new Error(
    `Test server did not become healthy on ${baseUrl} within ${timeoutMs}ms.\nRecent logs:\n${tail}`,
  );
}

async function stopChild(child) {
  if (child.exitCode !== null) {
    return;
  }

  child.kill('SIGINT');
  const exitedOnSigint = await waitForExit(child, 5000);
  if (exitedOnSigint) {
    return;
  }

  child.kill('SIGTERM');
  const exitedOnSigterm = await waitForExit(child, 3000);
  if (exitedOnSigterm) {
    return;
  }

  child.kill('SIGKILL');
  await waitForExit(child, 2000);
}

function waitForExit(child, timeoutMs) {
  return new Promise((resolve) => {
    if (child.exitCode !== null) {
      resolve(true);
      return;
    }

    const timer = setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeoutMs);

    const onExit = () => {
      cleanup();
      resolve(true);
    };

    const cleanup = () => {
      clearTimeout(timer);
      child.off('exit', onExit);
    };

    child.on('exit', onExit);
  });
}
