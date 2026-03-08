// /app/api/robots.txt/route.js
export async function GET() {
  const content = `
User-agent: *
Allow: /
Allow: /tr/
Allow: /en/
Disallow: /tr/member/*
Disallow: /en/member/*
Disallow: /api/*


Sitemap: https://biyomuhendislik.net.tr/sitemap.xml
Sitemap: https://biyomuhendislik.net.tr/tr/sitemap.xml
Sitemap: https://biyomuhendislik.net.tr/en/sitemap.xml
  `.trim();

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}