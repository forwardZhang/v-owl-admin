import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import type { Connect, Plugin } from 'vite';
import { AntdvNextResolver } from '@antdv-next/auto-import-resolver';
import { parseMockBody, resolveMockRequest } from './src/mock/server';
// vite.config.ts
import Components from 'unplugin-vue-components/vite';

function readRequestBody(req: Connect.IncomingMessage) {
  return new Promise<string>((resolveBody, reject) => {
    const chunks: Uint8Array[] = [];

    req.on('data', (chunk: Buffer | string) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });

    req.on('end', () => {
      resolveBody(Buffer.concat(chunks).toString('utf-8'));
    });

    req.on('error', reject);
  });
}

function buildQueryParams(url: URL) {
  const result: Record<string, string | string[]> = {};

  url.searchParams.forEach((value, key) => {
    const current = result[key];

    if (typeof current === 'undefined') {
      result[key] = value;
      return;
    }

    result[key] = Array.isArray(current) ? [...current, value] : [current, value];
  });

  return result;
}

function createHeaderMap(req: Connect.IncomingMessage) {
  return Object.entries(req.headers).reduce<Record<string, string>>((result, [key, value]) => {
    if (Array.isArray(value)) {
      result[key] = value.join(', ');
      return result;
    }

    if (typeof value === 'string') {
      result[key] = value;
    }

    return result;
  }, {});
}

function createMockApiPlugin(): Plugin {
  const middleware: Connect.NextHandleFunction = async (req, res, next) => {
    const requestUrl = req.url || '';

    if (!requestUrl.startsWith('/api/')) {
      next();
      return;
    }

    const method = req.method || 'GET';
    const url = new URL(requestUrl, 'http://localhost');
    const rawBody = ['GET', 'HEAD'].includes(method.toUpperCase())
      ? ''
      : await readRequestBody(req);
    const { payload, status } = await resolveMockRequest({
      data: parseMockBody(rawBody),
      headers: createHeaderMap(req),
      method,
      params: buildQueryParams(url),
      url: url.pathname
    });

    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
  };

  return {
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    name: 'adp-mock-api'
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createMockApiPlugin(),
    Components({
      resolvers: [AntdvNextResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  server: {
    port: 9528,
    open: true
  }
});
