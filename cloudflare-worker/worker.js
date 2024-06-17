const CUSTOM_CSS = `
.notion-header__cover.no-cover {
    max-height: 40px;
}
.notion-header__content.no-cover .notion-header__title-wrapper {
    margin-top: 84px;
}
.notion-header__icon-wrapper.no-cover.has-icon-image {
    top: -160px;
}
.notion-root.has-footer {
    padding-bottom: 3vh;
}
.giscus {
	  border-top: var(--divider-border);
    padding-top: 3vh;
    margin-top: 3vh;
}
.super-footer {
    padding-top: 3vh;
    pading-bottom: 3vh;
}
.super-footer__icons {
    margin-bottom: 8px;
}
.super-badge {
    display:none;
}
`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/custom.css': return new Response(CUSTOM_CSS, { headers: { 'Content-Type': 'text/css' } });
      case '/custom.js': return this.handleCustomJs(env);
      case '/robots.txt': return this.handleRobots(env);
      case '/sitemap.xml': return this.handleSitemaps(request, env);
      default: return this.handleProxyRequest(request, env);
    }
  },

  async handleRobots(env) {
    return new Response(`User-agent: *
Disallow:
Disallow: /api
Disallow: /_next
Allow: /_next/static/css
Sitemap: https://${env.SERVE_DOMAIN}/sitemap.xml`, { headers: { 'Content-Type': 'text/plain' } });
  },

  async handleSitemaps(request, env) {
    const proxyUrl = new URL(request.url);
    proxyUrl.hostname = env.TARGET_DOMAIN;

    let response = await fetch(proxyUrl.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.body,
    });

    let text = await response.text();
    text = text.replaceAll(env.TARGET_DOMAIN, env.SERVE_DOMAIN);
    return new Response(text, response);
  },

  async handleCustomJs(env) {
    return new Response(`
    function onNagivateCompleted() {
      var giscusDiv = document.createElement("div");
      giscusDiv.className = "giscus";
      if (!document.querySelector(".giscus")) {
          document.querySelector("article").appendChild(giscusDiv);
      }
    
      var script = document.createElement("script");
      script.src = "https://giscus.app/client.js";
      script.setAttribute("data-repo", "${env.GISCUS_REPO}");
      script.setAttribute("data-repo-id", "${env.GISCUS_REPO_ID}");
      script.setAttribute("data-category", "${env.GISCUS_CATEGORY}");
      script.setAttribute("data-category-id", "${env.GISCUS_CATEGORY_ID}");
      script.setAttribute("data-mapping", "pathname");
      script.setAttribute("data-strict", "0");
      script.setAttribute("data-reactions-enabled", "1");
      script.setAttribute("data-emit-metadata", "0");
      script.setAttribute("data-input-position", "bottom");
      script.setAttribute("data-theme", "light");
      script.setAttribute("data-lang", "ko");
      script.setAttribute("crossorigin", "anonymous");
      script.async = true;
      document.head.appendChild(script);
    
      const links = document.querySelectorAll("a.notion-link");
      links.forEach(link => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("/")) {
          window.next.router.prefetch(href);
        }
      });
    }
      
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function(state) {
      const result = originalPushState.apply(history, arguments);
      setTimeout(onNagivateCompleted, 500);
      return result;
    };
    history.replaceState = function(state) {
      const result = originalReplaceState.apply(history, arguments);
      setTimeout(onNagivateCompleted, 500);
      return result;
    };
    
    document.addEventListener("DOMContentLoaded", ()=>setTimeout(onNagivateCompleted, 500));
    `, { headers: { 'Content-Type': 'text/javascript' } });
  },

  async handleProxyRequest(request, env) {
    const proxyUrl = new URL(request.url);
    proxyUrl.hostname = env.TARGET_DOMAIN;

    let response = await fetch(proxyUrl.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.body,
    });

    if (response.headers.get('content-type')?.includes('text/html')) {
      let text = await response.text();
      text = text.replace('</head>', `<link rel="stylesheet" href="/custom.css"></head>`)
        .replace('<meta name="robots" content="noindex, nofollow" />', '')
        .replace('</body>', '<script type="text/javascript" src="/custom.js"></script></body>');
      return new Response(text, response);
    }
    return response;
  }
};