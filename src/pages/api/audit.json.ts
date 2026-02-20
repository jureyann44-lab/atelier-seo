import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { url } = await request.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL manquante' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = import.meta.env.PUBLIC_GOOGLE_API_KEY || '';
    console.log('🔑 API Key chargée:', apiKey ? 'OUI (' + apiKey.substring(0, 10) + '...)' : 'NON - VIDE !');
    
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=seo&strategy=mobile${apiKey ? `&key=${apiKey}` : ''}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('⏰ Trop de requêtes. Veuillez patienter quelques minutes.');
      }
      throw new Error(`Erreur API Google (code ${response.status})`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('❌ Erreur audit:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Impossible d\'analyser cette URL.' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};