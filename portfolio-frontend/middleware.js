export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only act on blog detail pages
  if (!pathname.startsWith('/blog/')) {
    return undefined; // continue to normal handling
  }

  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  // Expanded bot detection list (common crawlers and social scrapers)
  const BOT_AGENTS = [
    'facebookexternalhit', 'facebot', 'twitterbot', 'slackbot', 'linkedinbot',
    'whatsapp', 'telegrambot', 'pinterest', 'googlebot', 'bingbot',
    'yandex', 'baiduspider', 'applebot', 'embedly', 'redditbot', 'discordbot',
    'duckduckbot', 'slurp', 'msnbot', 'semrushbot', 'ahrefsbot', 'seokicks',
    'mj12bot', 'rogerbot', 'exabot', 'dotbot', 'screaming frog', 'mediapartners-google',
    'apis-google', 'adsbot-google', 'google-structured-data-testing-tool',
    'googleweblight', 'mediabot', 'linkpreview', 'outbrain', 'quora link preview',
    'skypeuripreview', 'tumblr', 'vkshare', 'w3c_validator', 'whatsapp',
    'yahoo! slurp', 'yandexbot', 'zoominfobot', 'medimate-linkpreview', 'pinterestbot', 'bitlybot', 'flipboardproxy', 'google favicon', 'apple news bot', 'google web preview', 'chrome-lighthouse', 'headlesschrome', 'python-requests', 'curl', 'wget', 'httpclient', 'okhttp', 'java', 'libwww-perl', 'php', 'ruby', 'go-http-client', 'node-fetch', 'axios', 'httpie', 'postmanruntime', 'insomnia', 'restsharp', 'httpclient', 'httpx', 'zgrab', 'masscan', 'nmap', 'fiddler', 'burp', 'owasp zap', 'sqlmap', 'acunetix', 'nessus', 'nikto', 'openvas', 'netsparker', 'w3af', 'arachni', 'skipfish', 'havij', 'webscarab', 'ratproxy', 'paros', 'zaproxy', 'fuzzer', 'dirbuster', 'gobuster', 'wfuzz', 'ffuf', 'bruteforce', 'hydra', 'medusa', 'ncrack', 'john the ripper', 'hashcat', 'burpsuite', 'sqlninja', 'sqlsus', 'sqlmap', 'xssed', 'xsssniper', 'xsser', 'beef', 'metasploit', 'cobalt strike', 'empire', 'powershell empire', 'pupy', 'ghostosint', 'theharvester', 'maltego', 'recon-ng', 'shodan', 'ADELA-LinkPreview', 'censys', 'zoomeye'
  ];

  const botRegex = new RegExp(BOT_AGENTS.map(a => a.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|'), 'i');
  if (!botRegex.test(ua)) {
    return undefined; // not a crawler
  }

  try {
    const id = pathname.split('/').pop();
    if (!id) return undefined;

    const BACKEND = (process.env.VITE_API_URL || process.env.API_BASE_URL || 'https://portfolio-backend-ckqx.onrender.com').replace(/\/$/, '');
    const seoUrl = `${BACKEND}/api/blog/seo/${id}`;

    const res = await fetch(seoUrl, { method: 'GET' });
    const text = await res.text();

    // Forward content-type and use caching for crawlers
    const headers = new Headers();
    const contentType = res.headers.get('content-type') || 'text/html; charset=utf-8';
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    // Also copy known safe headers like ETag / Last-Modified
    const etag = res.headers.get('etag');
    if (etag) headers.set('ETag', etag);
    const last = res.headers.get('last-modified');
    if (last) headers.set('Last-Modified', last);

    return new Response(text, { status: res.status, headers });
  } catch (err) {
    console.error('Middleware SEO proxy error:', err);
    return undefined; // fallback to normal SPA
  }
}
