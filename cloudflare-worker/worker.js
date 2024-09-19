import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      switch (url.pathname) {
        case '/favicon.ico':
        case '/customized.common.css':
        case '/onNavigateCompleted.js':
        case '/giscus.js':
        case '/google-analytics.js':
        case '/customized.per-site.css':
        case '/customized.per-site.js':
          return await getAssetFromKV(
            {
              request,
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: assetManifest,
            }
          );
        case '/robots.txt': return this.handleRobots(env);
        case '/sitemap.xml': return this.proxySitemaps(request, env);
        default: return this.proxyRequests(request, env);
      }
    } catch (e) {
      let pathname = new URL(request.url).pathname;
      return new Response(`"${pathname}" not found`, {
        status: 404,
        statusText: 'not found',
      });
    }
  },

  async proxyRequests(request, env) {
    const proxyUrl = new URL(request.url);
    proxyUrl.hostname = env.TARGET_DOMAIN;

    const originalResponse = await fetch(proxyUrl.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.body,
    });

    if (originalResponse.headers.get('content-type')?.includes('text/html')) {
      const body = await originalResponse.text();
      const modifiedBody = body
        .replace('</head>', '<link rel="stylesheet" href="/customized.common.css"><link rel="stylesheet" href="/customized.per-site.css"></head>')
        .replace('</body>',
          '<script type="text/javascript" src="/giscus.js"></script>' +
          '<script type="text/javascript" src="/google-analytics.js"></script>' +
          '<script type="text/javascript" src="/onNavigateCompleted.js"></script>' +
          '<script type="text/javascript" src="/customized.per-site.js"></script></body>')
        .replace(new RegExp('<meta name="robots" content="noindex, nofollow".+/>'), '')
        .replace(/\[\\"\$\\",\s*\\"meta\\",\s*\\"\d\\",\s*\{\\"name\\":\s*\\"robots\\",\s*\\"content\\":\s*\\"noindex,\s*nofollow\\"\}\]\,/, '')

      return new Response(modifiedBody, originalResponse);
    }
    return originalResponse;
  },

  async proxySitemaps(request, env) {
    const proxyUrl = new URL(request.url);
    proxyUrl.hostname = env.TARGET_DOMAIN;

    let response = await fetch(proxyUrl.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.body,
    });

    const text = await response.text();
    return new Response(text.replaceAll(env.TARGET_DOMAIN, env.SERVE_DOMAIN), response);
  },

  async handleRobots(env) {
    return new Response(`User-agent: *
Disallow:
Disallow: /api
Disallow: /_next
Allow: /_next/static/css
Sitemap: https://${env.SERVE_DOMAIN}/sitemap.xml`,
      { headers: { 'Content-Type': 'text/plain' } }
    );
  },
};