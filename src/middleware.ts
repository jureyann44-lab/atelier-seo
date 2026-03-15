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
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://static.cloudflareinsights.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "img-src 'self' data: blob: https:; " +
  "connect-src 'self' https://api.netlify.com https://api.github.com https://raw.githubusercontent.com https://github.com https://unpkg.com https://cloudflareinsights.com; " +
  "frame-src https://github.com https://api.netlify.com; " +
  "form-action 'self' https://github.com https://api.netlify.com; " +
  "worker-src 'self' blob:;";

export const onRequest = defineMiddleware(async ({ url }, next) => {
  const response = await next();

  const isAdmin = url.pathname.startsWith('/admin');

  if (!isAdmin) {
    response.headers.set('Content-Security-Policy', CSP_DEFAULT);
  } else {
    response.headers.set('Content-Security-Policy', CSP_ADMIN);
    response.headers.set('X-Robots-Tag', 'noindex');
  }

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return response;
});