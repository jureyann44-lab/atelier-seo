import { defineMiddleware } from 'astro:middleware';

const CSP =
  "default-src 'self'; " +
  "connect-src 'self' https://proud-bush-8032atelier-seo-contact-form.jure-yann44.workers.dev https://cloudflareinsights.com https://api.github.com https://raw.githubusercontent.com https://github.com https://unpkg.com; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloudflareinsights.com https://static.cloudflareinsights.com https://unpkg.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; " +
  "img-src 'self' data: blob: https:; " +
  "font-src 'self' data: https://fonts.gstatic.com; " +
  "frame-src https://github.com; " +
  "form-action 'self' https://github.com; " +
  "worker-src 'self' blob:;";

export const onRequest = defineMiddleware(async (_, next) => {
  const response = await next();

  response.headers.set('Content-Security-Policy', CSP);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  return response;
});