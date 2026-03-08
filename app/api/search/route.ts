// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Import Supabase with proper ES modules syntax
import { supabase as supabaseClient } from '@/lib/supabase';

// Define proper types for database entities
interface BlogPostDb {
  post_id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  image: string | null;
  content?: string;
}

interface BlogPostTagDb {
  post_id: string;
  tag: string;
}

// Define result types
interface SearchResultItem {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  type: 'blog' | 'page' | 'event' | 'project';
  image?: string;
  category?: string;
  date?: string;
  tags?: string[];
}

// Static page definition
interface StaticPage {
  path: string;
  name: string;
}

// Helper function to format date in Turkish format
const formatDateTurkish = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  } catch {
    return dateStr; // Return original if any error
  }
};

// Helper function to format date in English format
const formatDateEnglish = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr; // Return original if any error
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const locale = searchParams.get('locale') || 'tr';

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    // Sanitize and normalize search query
    const sanitizedQuery = query.trim().toLowerCase();
    
    if (sanitizedQuery.length < 2) {
      return NextResponse.json({ 
        results: [],
        message: 'Search query must be at least 2 characters long'
      });
    }

    // Create an array to store all search results
    const allResults: SearchResultItem[] = [];
    
    // Check if we have a valid supabase instance
    try {
      // Search blog posts - Try catch this entire block
      try {
        const { data: blogPosts, error: blogError } = await supabaseClient
          .from('blog_posts')
          .select(`
            post_id,
            title,
            slug,
            excerpt,
            category,
            date,
            image
          `)
          .eq('locale', locale)
          .or(`title.ilike.%${sanitizedQuery}%,excerpt.ilike.%${sanitizedQuery}%,content.ilike.%${sanitizedQuery}%`)
          .order('date', { ascending: false })
          .limit(20);

        if (blogError) {
          console.error('Error searching blog posts:', blogError);
        } else if (blogPosts && blogPosts.length > 0) {
          // Process blog posts results
          const blogResults = blogPosts.map((post: BlogPostDb) => {
            let formattedDate = post.date;
            if (post.date) {
              formattedDate = locale === 'tr' 
                ? formatDateTurkish(post.date)
                : formatDateEnglish(post.date);
            }
            
            return {
              id: post.post_id,
              title: post.title,
              excerpt: post.excerpt,
              url: `/${locale}/blog/${post.slug}`,
              type: 'blog' as const,
              image: post.image ? getFullStorageUrl(post.image) : undefined,
              category: post.category,
              date: formattedDate
            };
          });
          
          // Add to all results
          allResults.push(...blogResults);
          
          // Try to fetch tags in a separate try/catch
          try {
            if (blogPosts.length > 0) {
              const postIds = blogPosts.map((post: BlogPostDb) => post.post_id);
              const { data: tags, error: tagsError } = await supabaseClient
                .from('blog_post_tags')
                .select('post_id, tag')
                .eq('locale', locale)
                .in('post_id', postIds);
                
              if (tagsError) {
                console.error('Error fetching tags:', tagsError);
              } else if (tags && tags.length > 0) {
                // Create a map of post_id to tags
                const tagMap = new Map<string, string[]>();
                tags.forEach((tag: BlogPostTagDb) => {
                  if (!tagMap.has(tag.post_id)) {
                    tagMap.set(tag.post_id, []);
                  }
                  const tagArray = tagMap.get(tag.post_id);
                  if (tagArray) {
                    tagArray.push(tag.tag);
                  }
                });
                
                // Update blog results with tags
                for (let i = 0; i < allResults.length; i++) {
                  const result = allResults[i];
                  if (result.type === 'blog' && tagMap.has(result.id)) {
                    result.tags = tagMap.get(result.id);
                  }
                }
              }
            }
          } catch (tagsError) {
            console.error('Error processing tags:', tagsError);
            // Continue without tags
          }
        }
      } catch (dbError) {
        console.error('Database query error:', dbError);
        // Continue with static pages
      }
    } catch (supabaseError) {
      console.error('Supabase client error:', supabaseError);
      // Continue with static pages
    }

    // Add static pages (this doesn't require database)
    try {
      const staticPages: StaticPage[] = [];
      
      // Define pages based on locale
      if (locale === 'tr') {
        staticPages.push(
          { path: '', name: 'Ana Sayfa' },
          { path: 'hakkimizda', name: 'Hakkımızda' },
          { path: 'kariyer', name: 'Kariyer' },
          { path: 'gizlilik', name: 'Gizlilik' },
          { path: 'sartlar-ve-kosullar', name: 'Şartlar ve Koşullar' },
          { path: 'blog', name: 'Blog' },
          { path: 'iletisim', name: 'İletişim' },
          { path: 'projelerimiz', name: 'Projelerimiz' },
          { path: 'hizmetlerimiz', name: 'Hizmetlerimiz' }
        );
      } else if (locale === 'en') {
        staticPages.push(
          { path: '', name: 'Home' },
          { path: 'about', name: 'About' },
          { path: 'careers', name: 'Careers' },
          { path: 'blog', name: 'Blog' },
          { path: 'contact', name: 'Contact' },
          { path: 'projects', name: 'Projects' },
          { path: 'services', name: 'Services' }
        );
      }
      
      const pageResults = staticPages
        .filter(page => {
          const pageName = page.name.toLowerCase();
          const pagePath = page.path.toLowerCase();
          return pageName.includes(sanitizedQuery) || pagePath.includes(sanitizedQuery);
        })
        .map(page => ({
          id: `page-${page.path || 'home'}`,
          title: page.name,
          excerpt: locale === 'tr' 
            ? `${page.name} sayfasına git` 
            : `Go to ${page.name} page`,
          url: `/${locale}${page.path ? `/${page.path}` : ''}`,
          type: 'page' as const,
          date: locale === 'tr'
            ? formatDateTurkish(new Date().toISOString())
            : formatDateEnglish(new Date().toISOString())
        }));
      
      if (pageResults.length > 0) {
        allResults.push(...pageResults);
      }
    } catch (pagesError) {
      console.error('Error processing static pages:', pagesError);
      // Continue with whatever results we have
    }

    // Set proper headers explicitly
    const response = NextResponse.json({ 
      results: allResults,
      query: sanitizedQuery
    });
    
    // Explicitly set content-type
    response.headers.set('Content-Type', 'application/json');
    
    return response;

  } catch (error) {
    console.error('Search API error:', error);
    
    // Create a response with proper JSON format and content-type
    const response = NextResponse.json({ 
      results: [],
      error: 'Failed to perform search',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
    
    // Explicitly set content-type
    response.headers.set('Content-Type', 'application/json');
    
    return response;
  }
}

// Helper function to get full storage URL for images
function getFullStorageUrl(path: string | null): string {
  if (!path) return '/blog/default-image.webp'; // Default image
  
  // If URL is already complete, don't modify it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If path starts with /blog/, it's likely a static file path
  if (path.startsWith('/blog/')) {
    return path;
  }
  
  // Add leading slash if missing
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  
  // Supabase storage URL
  const baseUrl = "https://ghuellgktqqzpryuyiky.supabase.co/storage/v1/object/public/blog-images";
  
  return baseUrl + normalizedPath;
}