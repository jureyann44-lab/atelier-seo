/**
 * GET /callback
 * Reçoit le code GitHub, l'échange contre un token, renvoie le token à Decap CMS
 * via postMessage (fenêtre popup).
 */
export async function onRequestGet(context) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = context.env;

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    return new Response("Variables d'environnement manquantes", { status: 500 });
  }

  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");
  const errorParam = url.searchParams.get("error");

  if (errorParam) {
    return htmlResponse("error", errorParam);
  }

  if (!code) {
    return new Response("Paramètre 'code' manquant", { status: 400 });
  }

  let tokenData;
  try {
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      }
    );
    tokenData = await tokenRes.json();
  } catch (err) {
    return htmlResponse("error", "Échec de la requête vers GitHub");
  }

  if (tokenData.error) {
    return htmlResponse("error", tokenData.error_description ?? tokenData.error);
  }

  return htmlResponse("success", tokenData.access_token);
}

function htmlResponse(status, content) {
  const message =
    status === "success"
      ? `authorization:github:success:${JSON.stringify({
          token: content,
          provider: "github",
        })}`
      : `authorization:github:error:${JSON.stringify({ message: content })}`;

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Authentification GitHub</title>
  </head>
  <body>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(${JSON.stringify(message)}, e.origin);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
