/**
 * GET /auth
 * Redirige vers GitHub OAuth — point d'entrée pour Decap CMS.
 */
export async function onRequestGet(context) {
  const { GITHUB_CLIENT_ID } = context.env;

  if (!GITHUB_CLIENT_ID) {
    return new Response("GITHUB_CLIENT_ID non configuré", { status: 500 });
  }

  const origin = new URL(context.request.url).origin;
  const redirectUri = `${origin}/callback`;

  const githubUrl = new URL("https://github.com/login/oauth/authorize");
  githubUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  githubUrl.searchParams.set("redirect_uri", redirectUri);
  githubUrl.searchParams.set("scope", "repo,user");

  return Response.redirect(githubUrl.toString(), 302);
}
