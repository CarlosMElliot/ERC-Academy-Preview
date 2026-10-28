const { randomUUID } = require('node:crypto');
const articles = require('../data/articles.json');
const countries = require('../data/comment-countries.json');
const repo = 'CarlosMElliot/ERC-Academy-Preview';
const fail = (status, message) => Object.assign(new Error(message), { status });
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const send = (status, data) => res.status(status).json(data);
  try {
    if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return send(405, { error: 'Método no permitido.' }); }
    const slug = req.query.article;
    if (typeof slug !== 'string' || !articles.includes(slug)) throw fail(404, 'Artículo no encontrado.');
    const token = process.env.ERC_COMMENTS_GITHUB_TOKEN;
    if (!token) return send(req.method === 'GET' ? 200 : 503, { enabled: false, comments: [], error: 'Los comentarios aún no están disponibles.' });
    const url = `https://api.github.com/repos/${repo}/contents/data/article-comments/${slug}.json`;
    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' };
    async function read() {
      const r = await fetch(url + '?ref=main', { headers, signal: AbortSignal.timeout(8000) });
      if (r.status === 404) return { comments: [], sha: undefined };
      if (!r.ok) throw fail(503, 'No podemos conectar con los comentarios. Intenta más tarde.');
      const file = await r.json();
      const comments = JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
      if (!Array.isArray(comments)) throw Error('Invalid storage');
      return { comments, sha: file.sha };
    }
    if (req.method === 'GET') { const { comments } = await read(); return send(200, { enabled: true, comments: comments.slice().reverse() }); }
    const origins = ['https://erc-betapreview.vercel.app', 'https://ercacademynic.com', 'https://www.ercacademynic.com'];
    if (process.env.VERCEL_URL) origins.push('https://' + process.env.VERCEL_URL);
    if (!origins.includes(req.headers.origin)) throw fail(403, 'Publica desde la página del artículo.');
    if (!(req.headers['content-type'] || '').startsWith('application/json')) throw fail(415, 'Formato no válido.');
    if (Number(req.headers['content-length']) > 16000) throw fail(413, 'El comentario es demasiado largo.');
    let body = req.body;
    if (typeof body === 'string') { if (Buffer.byteLength(body) > 16000) throw fail(413, 'El comentario es demasiado largo.'); try { body = JSON.parse(body); } catch { throw fail(400, 'Datos no válidos.'); } }
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw fail(400, 'Datos no válidos.');
    if (body.website) throw fail(400, 'No se pudo publicar.');
    const clean = (v) => typeof v === 'string' ? v.trim().replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '') : '';
    const name = clean(body.name), text = clean(body.text), country = body.country;
    if (!name || name.length > 60 || text.length < 3 || text.length > 2000 || !Object.hasOwn(countries, country)) throw fail(400, 'Revisa tu nombre, país y comentario (3–2000 caracteres).');
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submissionId || '')) throw fail(400, 'Recarga la página e intenta otra vez.');
    const comment = { id: randomUUID(), submissionId: body.submissionId, name, country, text, createdAt: new Date().toISOString() };
    for (let attempt = 0; attempt < 3; attempt++) {
      const { comments, sha } = await read();
      const existing = comments.find(c => c.submissionId === body.submissionId);
      if (existing) return send(200, { comment: existing });
      if (comments.length >= 500) throw fail(503, 'Este artículo ha alcanzado su límite de comentarios.');
      if (comments.some(c => Date.now() - Date.parse(c.createdAt) < 15000)) { res.setHeader('Retry-After', '15'); throw fail(429, 'Espera 15 segundos antes de publicar otra vez.'); }
      const content = Buffer.from(JSON.stringify([...comments, comment], null, 2) + '\n').toString('base64');
      const r = await fetch(url, { method: 'PUT', headers, signal: AbortSignal.timeout(8000), body: JSON.stringify({ message: `Comment on ${slug} [skip ci]`, content, branch: 'main', ...(sha ? { sha } : {}) }) });
      if (r.ok) return send(201, { comment });
      if (r.status !== 409 && r.status !== 422) throw fail(503, 'No se pudo confirmar el guardado. Conserva tu texto e intenta otra vez.');
    }
    throw fail(409, 'Hay otra publicación en curso. Intenta otra vez.');
  } catch (error) { return send(error.status || 503, { error: error.status ? error.message : 'No se pudo confirmar el guardado. Conserva tu texto e intenta otra vez.' }); }
};
