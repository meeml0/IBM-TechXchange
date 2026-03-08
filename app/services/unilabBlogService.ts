// app/services/unilabBlogService.ts
import { supabase } from '@/lib/supabase';

// UNILAB Vision blog types - simplified without author, reading time, comments
export interface UnilabBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  tags: string[];
  featured: boolean;
  alternateSlug?: string;
}

export interface UnilabBlogContent {
  title: string;
  description: string;
  categories: string[];
  posts: UnilabBlogPost[];
  featured: UnilabBlogPost[];
}

// Storage URL helper function
const getFullStorageUrl = (path: string | null): string => {
  if (!path) return '/blog/default-image.webp';
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  if (path.startsWith('/blog/')) {
    return path;
  }
  
  const normalizedPath = path.startsWith('/') ? path : '/' + path;
  const baseUrl = "https://ghuellgktqqzpryuyiky.supabase.co/storage/v1/object/public/unilab-vision-uploads";
  
  return baseUrl + normalizedPath;
};

/**
 * Get alternate language version slug for a blog post
 */
export async function getUnilabBlogPostAlternateSlug(postId: string, targetLocale: string): Promise<string | null> {
  try {
    
    // First, get the current post to find its alternate_post_id
    const { data: currentPost, error: currentError } = await supabase
      .from('unilab_vision_blog_posts')
      .select('post_id, locale, slug, alternate_post_id')
      .eq('id', postId)
      .single();
    
    if (currentError || !currentPost) {
      console.warn(`Could not find current post with id ${postId}:`, currentError);
      return null;
    }
    
    
    // If no alternate_post_id, no alternate version exists
    if (!currentPost.alternate_post_id) {
      return null;
    }
    
    // Find the alternate post using alternate_post_id
    const { data: alternatePost, error: alternateError } = await supabase
      .from('unilab_vision_blog_posts')
      .select('slug, locale, id, post_id')
      .eq('post_id', currentPost.alternate_post_id)
      .eq('locale', targetLocale)
      .single();
    
    if (alternateError || !alternatePost) {
      console.warn(`No alternate version found for alternate_post_id ${currentPost.alternate_post_id} in locale ${targetLocale}:`, alternateError);
      return null;
    }
    
    
    return alternatePost.slug;
  } catch (error) {
    console.error('Error fetching alternate slug:', error);
    return null;
  }
}

/**
 * Fetch all blog categories for a specific locale
 */
export async function getUnilabBlogCategories(locale: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('unilab_vision_blog_categories')
      .select('name')
      .eq('locale', locale)
      .order('name');
    
    if (error) throw error;
    
    return data.map(category => category.name);
  } catch (error) {
    console.error('Error fetching UNILAB blog categories:', error);
    // Return default categories if fetch fails
    return locale === 'tr' 
      ? ["Yapay Zeka", "Makine Öğrenmesi", "Bilgisayarlı Görü", "Veri Bilimi", "Araştırma", "İnovasyon"]
      : ["Artificial Intelligence", "Machine Learning", "Computer Vision", "Data Science", "Research", "Innovation"];
  }
}

/**
 * Fetch all blog posts for a specific locale
 */
export async function getUnilabBlogPosts(locale: string): Promise<UnilabBlogPost[]> {
  try {
    // Get all blog posts for the locale
    const { data: posts, error: postsError } = await supabase
      .from('unilab_vision_blog_posts')
      .select(`
        id,
        post_id,
        title,
        slug,
        category,
        excerpt,
        content,
        date,
        image,
        featured
      `)
      .eq('locale', locale)
      .order('date', { ascending: false });
    
    if (postsError) throw postsError;
    
    if (!posts || !posts.length) {
      return [];
    }
    
    // Get all tags for all posts in this locale
    const postIds = posts.map(post => post.post_id);
    const { data: tags, error: tagsError } = await supabase
      .from('unilab_vision_blog_post_tags')
      .select('post_id, tag')
      .eq('locale', locale)
      .in('post_id', postIds);
    
    if (tagsError) {
      console.warn('Error fetching UNILAB blog tags:', tagsError);
    }
    
    // Create a map of post_id to tags for quick lookup
    const tagMap = new Map();
    if (tags) {
      tags.forEach(tag => {
        if (!tagMap.has(tag.post_id)) {
          tagMap.set(tag.post_id, []);
        }
        tagMap.get(tag.post_id).push(tag.tag);
      });
    }
    
    // Build the complete blog posts
    return posts.map(post => ({
      id: post.id, // Use the table id, not post_id
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      image: getFullStorageUrl(post.image),
      tags: tagMap.get(post.post_id) || [],
      featured: post.featured
    }));
  } catch (error) {
    console.error('Error fetching UNILAB blog posts:', error);
    return [];
  }
}

/**
 * Fetch featured blog posts for a specific locale
 */
export async function getUnilabFeaturedBlogPosts(locale: string): Promise<UnilabBlogPost[]> {
  try {
    const allPosts = await getUnilabBlogPosts(locale);
    const featured = allPosts.filter(post => post.featured);
    
    // If no featured posts, use the first 2 posts
    if (featured.length === 0 && allPosts.length > 0) {
      return allPosts.slice(0, 2);
    }
    
    return featured;
  } catch (error) {
    console.error('Error fetching UNILAB featured blog posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug for a specific locale
 */
export async function getUnilabBlogPostBySlug(slug: string, locale: string): Promise<UnilabBlogPost | null> {
  try {
    if (!slug) {
      console.error('No slug provided to getUnilabBlogPostBySlug');
      return null;
    }

    // Fetch the post by slug
    const { data: post, error } = await supabase
      .from('unilab_vision_blog_posts')
      .select(`
        id,
        post_id,
        title,
        slug,
        category,
        excerpt,
        content,
        date,
        image,
        featured
      `)
      .eq('locale', locale)
      .eq('slug', slug)
      .single();

    if (error || !post) {
      console.warn(`UNILAB blog post with slug "${slug}" not found:`, error);
      return null;
    }

    // Fetch tags for the post
    const { data: tags, error: tagsError } = await supabase
      .from('unilab_vision_blog_post_tags')
      .select('tag')
      .eq('locale', locale)
      .eq('post_id', post.post_id);

    if (tagsError) {
      console.warn('Error fetching UNILAB blog tags:', tagsError);
    }

    // Build the complete blog post
    return {
      id: post.id, // Use the table id, not post_id
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      image: getFullStorageUrl(post.image),
      tags: tags ? tags.map(tag => tag.tag) : [],
      featured: post.featured,
    };
  } catch (error) {
    console.error(`Error fetching UNILAB blog post with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch related blog posts for a specific post
 */
export async function getUnilabRelatedBlogPosts(post: UnilabBlogPost, locale: string, limit: number = 3): Promise<UnilabBlogPost[]> {
  try {
    if (!post) {
      console.warn('No post provided to getUnilabRelatedBlogPosts');
      return [];
    }
    
    // Get posts from the same category first
    const { data: relatedPosts, error } = await supabase
      .from('unilab_vision_blog_posts')
      .select(`
        id,
        post_id,
        title,
        slug,
        category,
        date,
        excerpt,
        content,
        image,
        featured
      `)
      .eq('locale', locale)
      .eq('category', post.category)
      .neq('id', post.id) // Use id instead of post_id
      .limit(limit);
      
    if (error || !relatedPosts || relatedPosts.length === 0) {
      
      // If no posts in same category, get random posts
      const { data: randomPosts, error: randomError } = await supabase
        .from('unilab_vision_blog_posts')
        .select(`
          id,
          post_id,
          title,
          slug,
          category,
          excerpt,
          content,
          date,
          image,
          featured
        `)
        .eq('locale', locale)
        .neq('id', post.id) // Use id instead of post_id
        .limit(limit);
        
      if (randomError || !randomPosts || randomPosts.length === 0) {
        return [];
      }
      
      return Promise.all(randomPosts.map(async (relatedPost) => {
        // Get tags for each post
        const { data: tagsData } = await supabase
          .from('unilab_vision_blog_post_tags')
          .select('tag')
          .eq('locale', locale)
          .eq('post_id', relatedPost.post_id);
          
        const tags = tagsData ? tagsData.map(t => t.tag) : [];
        
        return {
          id: relatedPost.id, // Use the table id
          title: relatedPost.title,
          slug: relatedPost.slug,
          category: relatedPost.category,
          excerpt: relatedPost.excerpt || '',
          content: relatedPost.content || '',
          date: relatedPost.date,
          image: getFullStorageUrl(relatedPost.image),
          tags: tags,
          featured: relatedPost.featured || false
        };
      }));
    }
    
    // Process related posts from same category
    return Promise.all(relatedPosts.map(async (relatedPost) => {
      // Get tags for each post
      const { data: tagsData } = await supabase
        .from('unilab_vision_blog_post_tags')
        .select('tag')
        .eq('locale', locale)
        .eq('post_id', relatedPost.post_id);
        
      const tags = tagsData ? tagsData.map(t => t.tag) : [];
      
      return {
        id: relatedPost.id, // Use the table id
        title: relatedPost.title,
        slug: relatedPost.slug,
        category: relatedPost.category,
        excerpt: relatedPost.excerpt || '',
        content: relatedPost.content || '',
        date: relatedPost.date,
        image: getFullStorageUrl(relatedPost.image),
        tags: tags,
        featured: relatedPost.featured || false
      };
    }));
  } catch (error) {
    console.error('Error fetching UNILAB related blog posts:', error);
    return [];
  }
}

/**
 * Get complete blog content for a specific locale
 */
export async function getUnilabBlogContent(locale: string): Promise<UnilabBlogContent> {
  try {
    const [categories, allPosts, featuredPosts] = await Promise.all([
      getUnilabBlogCategories(locale),
      getUnilabBlogPosts(locale),
      getUnilabFeaturedBlogPosts(locale)
    ]);
    
    return {
      title: locale === 'tr' ? 'Blog' : 'Blog',
      description: locale === 'tr' 
        ? 'UNILAB Vision platformundaki en güncel araştırmalar, teknoloji haberleri ve inovasyon hikayeleri.'
        : 'Latest research, technology news, and innovation stories from the UNILAB Vision platform.',
      categories,
      posts: allPosts,
      featured: featuredPosts
    };
  } catch (error) {
    console.error('Error fetching UNILAB blog content:', error);
    
    return {
      title: 'Blog',
      description: locale === 'tr' 
        ? 'UNILAB Vision platformundaki en güncel araştırmalar ve teknoloji haberleri.'
        : 'Latest research and technology news from the UNILAB Vision platform.',
      categories: locale === 'tr' 
        ? ["Yapay Zeka", "Makine Öğrenmesi", "Bilgisayarlı Görü", "Veri Bilimi", "Araştırma", "İnovasyon"]
        : ["Artificial Intelligence", "Machine Learning", "Computer Vision", "Data Science", "Research", "Innovation"],
      posts: [],
      featured: []
    };
  }
}

/**
 * Search blog posts by query, category, or tag
 */
export async function searchUnilabBlogPosts(
  locale: string,
  query?: string,
  category?: string,
  tag?: string
): Promise<UnilabBlogPost[]> {
  try {
    let queryBuilder = supabase
      .from('unilab_vision_blog_posts')
      .select(`
        id,
        post_id,
        title,
        slug,
        category,
        excerpt,
        content,
        date,
        image,
        featured
      `)
      .eq('locale', locale);

    // Add category filter
    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    // Add text search in title, excerpt, and content
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`);
    }

    const { data: posts, error } = await queryBuilder.order('date', { ascending: false });

    if (error) throw error;
    if (!posts) return [];

    // Get tags for all posts
    const postIds = posts.map(post => post.post_id);
    const { data: tags } = await supabase
      .from('unilab_vision_blog_post_tags')
      .select('post_id, tag')
      .eq('locale', locale)
      .in('post_id', postIds);

    // Create tag map
    const tagMap = new Map();
    if (tags) {
      tags.forEach(tagItem => {
        if (!tagMap.has(tagItem.post_id)) {
          tagMap.set(tagItem.post_id, []);
        }
        tagMap.get(tagItem.post_id).push(tagItem.tag);
      });
    }

    // Build posts with tags
    let result = posts.map(post => ({
      id: post.id, // Use the table id
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      image: getFullStorageUrl(post.image),
      tags: tagMap.get(post.post_id) || [],
      featured: post.featured
    }));

    // Filter by tag if specified
    if (tag) {
      result = result.filter(post => post.tags.includes(tag));
    }

    return result;
  } catch (error) {
    console.error('Error searching UNILAB blog posts:', error);
    return [];
  }
}