export default async function handler(req, res) {
  try {
    const id = req.query?.id || (req.url && req.url.split('/').pop());
    if (!id) return res.status(400).send('Missing id');

    const BACKEND = process.env.VITE_API_URL || process.env.API_BASE_URL || 'https://portfolio-backend-ckqx.onrender.com';
    const seoUrl = `${BACKEND.replace(/\/$/, '')}/api/blog/seo/${id}`;

    const fetchRes = await fetch(seoUrl, { method: 'GET' });
    const html = await fetchRes.text();

    // Forward status and content-type
    const contentType = fetchRes.headers.get('content-type') || 'text/html; charset=utf-8';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(fetchRes.status).send(html);
  } catch (err) {
    console.error('SEO proxy error:', err);
    return res.status(500).send('Error fetching SEO page');
  }
}
