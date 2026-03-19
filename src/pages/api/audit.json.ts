import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { url } = await request.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL manquante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = (locals as any)?.runtime?.env?.GOOGLE_API_KEY || import.meta.env.GOOGLE_API_KEY || '';

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: '🔑 GOOGLE_API_KEY introuvable'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiUrl =
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
      `?url=${encodeURIComponent(url)}` +
      `&category=performance` +
      `&category=seo` +
      `&strategy=mobile` +
      `&key=${apiKey}`;

    const [psiResponse, securityData] = await Promise.all([
      fetch(apiUrl),
      checkSecurityHeaders(url)
    ]);

    if (!psiResponse.ok) {
      if (psiResponse.status === 429) {
        throw new Error('⏰ Trop de requêtes. Veuillez patienter quelques minutes.');
      }
      throw new Error(`Erreur API Google (code ${psiResponse.status})`);
    }

    const data = await psiResponse.json();
    data.securityHeaders = securityData;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('❌ Erreur audit:', error.message);

    return new Response(
      JSON.stringify({
        error: error.message || "Impossible d'analyser cette URL."
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

async function checkSecurityHeaders(url: string) {
  const headersToCheck = [
    { key: 'strict-transport-security', label: 'HSTS (HTTPS forcé)' },
    { key: 'content-security-policy', label: 'Content Security Policy' },
    { key: 'x-frame-options', label: 'X-Frame-Options (clickjacking)' },
    { key: 'x-content-type-options', label: 'X-Content-Type-Options' },
    { key: 'referrer-policy', label: 'Referrer Policy' },
    { key: 'permissions-policy', label: 'Permissions Policy' },
  ];

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'cf-no-loop': '1',
      },
      signal: AbortSignal.timeout(10000),
    });

    const results = headersToCheck.map(h => ({
      key: h.key,
      label: h.label,
      present: response.headers.has(h.key),
      value: response.headers.get(h.key) || null
    }));

    const presentCount = results.filter(r => r.present).length;
    const total = headersToCheck.length;
    const score = Math.round((presentCount / total) * 100);

    let grade: string;
    if (score >= 90) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 50) grade = 'C';
    else if (score >= 30) grade = 'D';
    else grade = 'F';

    return { results, score, grade, presentCount, total };

  } catch {
    return {
      results: headersToCheck.map(h => ({
        key: h.key,
        label: h.label,
        present: false,
        value: null
      })),
      score: 0,
      grade: 'F',
      presentCount: 0,
      total: headersToCheck.length,
      error: true
    };
  }
}