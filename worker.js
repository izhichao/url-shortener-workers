const generateRandomString = (length = 6) => {
  const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomCode += charset[randomIndex];
  }

  return randomCode;
};

const headers = {
  'content-type': 'application/json'
}

const handleRequest = async (request, env) => {
  const requestURL = new URL(request.url);
  const path = requestURL.pathname.split('/')[1];

  if (path === env.entry) {
    const html = await fetch('https://raw.githubusercontent.com/izhichao/url-shortener-workers/master/index.html');
    return new Response(await html.text(), { headers: { 'content-type': 'text/html;charset=UTF-8' } });
  }

  if (request.method === 'POST') {
    const body = await request.json();
    if (path === 'add') {
      const key = generateRandomString();
      await env.URLS.put(body.key || key, body.url);
      return new Response(`{"status":200, "key": "${key}"}`, { headers });
    } else if (path === 'delete') {
      await env.URLS.delete(body.key);
      return new Response(`{"status":200}`, { headers });
    }
  } else if (request.method === 'OPTIONS') {
    return new Response(null);
  }

  if (path) {
    const url = await env.URLS.get(path);
    if (url) {
      return Response.redirect(url, 302);
    }
  }

  return new Response(null, { status: 502 });
};

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  },
};