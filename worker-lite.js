const map = new Map();
map.set('baidu', 'https://baidu.com');

const handleRequest = async (request) => {
  const requestURL = new URL(request.url);
  const path = requestURL.pathname.split('/')[1];

  if (path) {
    const url = map.get(path);
    if (url) {
      return Response.redirect(url, 302);
    }
  }

  return new Response(null, { status: 502 });
};

export default {
  async fetch(request, ctx) {
    return handleRequest(request);
  },
};