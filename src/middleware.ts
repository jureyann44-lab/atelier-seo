import { defineMiddleware } from 'astro:middleware';

const CSP_DEFAULT =
  "default-src 'self'; " +
  "connect-src 'self' https://proud-bush-8032atelier-seo-contact-form.jure-yann44.workers.dev https://cloudflareinsights.com; " +
  "script-src 'self' 'unsafe-inline' https://cloudflareinsights.com https://static.cloudflareinsights.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' data: https://fonts.gstatic.com;";

const CSP_ADMIN =
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "img-src 'self' data: blob: https:; " +
  "connect-src 'self' https://api.github.com https://raw.githubusercontent.com https://cloudflareinsights.com; " +
  "frame-src https://github.com; " +
  "form-action 'self' https://github.com; " +
  "worker-src 'self' blob:;";

export const onRequest = defineMiddleware(({ url, request }, next) =>
  next().then((response) => {
    console.log('[CSP middleware] pathname:', url.pathname, '| startsWith /admin:', url.pathname.startsWith('/admin'));
    const isAdmin = url.pathname.startsWith('/admin');
    const csp = isAdmin ? CSP_ADMIN : CSP_DEFAULT;

    const headers = new Headers(response.headers);
    headers.set('Content-Security-Policy', csp);

    if (isAdmin) {
      headers.set('X-Robots-Tag', 'noindex');
    }

    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  })
);
