// app/api/sitemap.xml/route.js
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  // Supabase bağlantısı
  const baseUrl = 'https://biyomuhendislik.net.tr'
  let blogEntries = ''
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    // Blog yazılarını çek
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, category')
    
    if (error) {
      console.error('Blog verisi çekilirken hata oluştu:', error)
    } else if (blogPosts && blogPosts.length > 0) {
      
      // Her blog yazısı için XML girdileri oluştur
      blogPosts.forEach(post => {
        const trSlug = post.slug
        // İngilizce slug field'ı olmadığı için Türkçe slug'ı kullanıyoruz
        const enSlug = trSlug
        const lastmod = new Date().toISOString() 
        
        // Türkçe ve İngilizce blog yazısı girdileri
        blogEntries += `
  <url>
    <loc>${baseUrl}/blog/${trSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="tr-TR" href="${baseUrl}/blog/${trSlug}" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/en/blog/${enSlug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/blog/${trSlug}" />
  </url>
  <url>
    <loc>${baseUrl}/en/blog/${enSlug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en-US" href="${baseUrl}/en/blog/${enSlug}" />
    <xhtml:link rel="alternate" hreflang="tr-TR" href="${baseUrl}/blog/${trSlug}" />
  </url>`
      })
    }
  } catch (e) {
    console.error('Sitemap oluşturulurken hata oluştu:', e)
  }
  
  // Statik sayfalar ve dil karşılıkları
  const pages = [
    { tr: '', en: '' },
    { tr: 'hakkimizda', en: 'about' },
    { tr: 'kariyer', en: 'career' },
    { tr: 'gizlilik', en: 'privacy' },
    { tr: 'bultenimiz', en: 'newsletter' },
    { tr: 'sartlar-ve-kosullar', en: 'terms' },
    { tr: 'iletisim', en: 'contact' },
    { tr: 'hizmetlerimiz', en: 'services' }
  ]
  
  // Statik sayfalar için XML girdileri oluştur
  const staticEntries = pages.map(page => {
    const trUrl = `${baseUrl}/${page.tr}`
    const enUrl = `${baseUrl}/en/${page.en}`
    const lastmod = new Date().toISOString()
    
    return `
  <url>
    <loc>${trUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="tr-TR" href="${trUrl}" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${trUrl}" />
  </url>
  <url>
    <loc>${enUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en-US" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="tr-TR" href="${trUrl}" />
  </url>`
  }).join('')
  
  // Tam XML çıktısı oluştur
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${staticEntries}${blogEntries}
</urlset>`

  // XML olarak döndür
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}