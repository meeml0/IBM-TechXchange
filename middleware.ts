import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/tr',
  '/en',
  '/tr/hakkimizda(.*)',
    '/tr/analyze(.*)',
    '/en/analyze(.*)',
  '/en/about(.*)',
  '/tr/kariyer(.*)',
  '/en/career(.*)',
  '/tr/iletisim(.*)',
  '/en/contact(.*)',
  '/tr/blog(.*)',
  '/en/blog(.*)',
  '/tr/gizlilik(.*)',
  '/en/privacy(.*)',
  '/tr/projelerimiz(.*)',
  '/en/projects(.*)',
  '/tr/bultenimiz(.*)',
  '/en/newsletter(.*)',
  '/tr/sartlar-ve-kosullar(.*)',
  '/en/terms(.*)',
  '/tr/search(.*)',
  '/en/search(.*)',
  '/tr/soon(.*)',
  '/en/soon(.*)',
  '/tr/temsilcilik(.*)',
  '/en/temsilcilik(.*)',
  '/tr/member/login(.*)',
  '/en/member/login(.*)',
  '/tr/member/forgot-password(.*)',
  '/en/member/forgot-password(.*)',
  '/tr/member/reset-password(.*)',
  '/en/member/reset-password(.*)',
  '/tr/member/signup(.*)',
  '/en/member/signup(.*)',
  '/api/public(.*)',
  '/api/ai-chat(.*)',
  '/api/webhook(.*)',
  '/api/sitemap.xml',
  '/sitemap.xml',
  '/tr/sitemap.xml',
  '/en/sitemap.xml',
  '/api/comments',
  '/api/forms/submit',
  '/api/contact',
  '/api/newsletter',
  '/api/content',
  '/api/search',
  '/api/(.*)',
  '/tr/api/(.*)',
  '/en/api/(.*)',
  '/login(.*)',
  '/sign-up(.*)',
  '/tr/404',
  '/en/404',
  '/robots.txt',
]);

// Valid routes
const isValidRoute = createRouteMatcher([
  '/',
  '/tr',
  '/en',
  '/tr/hakkimizda(.*)',
  '/api/(.*)',
  '/api/(.*)',
  '/tr/api/(.*)',
  '/en/api/(.*)',
      '/tr/analyze(.*)',
    '/en/analyze(.*)',
  '/en/about(.*)',
  '/tr/kariyer(.*)',
  '/en/career(.*)',
  '/tr/iletisim(.*)',
  '/en/contact(.*)',
  '/tr/blog(.*)',
  '/en/blog(.*)',
  '/tr/soon(.*)',
  '/en/soon(.*)',
  '/tr/projelerimiz(.*)',
  '/en/projects(.*)',
  '/tr/search(.*)',
  '/en/search(.*)',
  '/tr/gizlilik(.*)',
  '/en/privacy(.*)',
  '/tr/bultenimiz(.*)',
  '/en/newsletter(.*)',
  '/tr/sartlar-ve-kosullar(.*)',
  '/en/terms(.*)',
  '/tr/member(.*)',
  '/en/member(.*)',
  '/tr/temsilcilik(.*)',
  '/en/temsilcilik(.*)',
  '/en/representative/application',
  '/tr/representative/application',
  '/sitemap.xml',
  '/tr/sitemap.xml',
  '/en/sitemap.xml',
  '/api/sitemap.xml',
  '/api(.*)',
  '/404',
  '/tr/404',
  '/en/404',
  '/robots.txt',
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Detect search engine bots (expanded list)
  const userAgent = req.headers.get('user-agent') || '';
  const isBot = /bot|crawler|spider|googlebot|bingbot|yandex|baidu|duckduck|yahoo|ahrefsbot|semrushbot|screaming frog|slurp|adsbot/i.test(userAgent);

  // Check for valid route first
  if (!isValidRoute(req)) {
    const locale = pathname.startsWith('/tr') ? 'tr' : 'en';
    return NextResponse.redirect(new URL(`/${locale}/404`, req.url));
  }

  // For bots, ONLY restrict them from member areas, allow them everywhere else
  if (isBot) {
    // Even bots shouldn't access member areas (except login/signup pages)
    if (pathname.includes('/member/') && 
        !pathname.includes('/member/login') && 
        !pathname.includes('/member/signup') && 
        !pathname.includes('/member/forgot-password') && 
        !pathname.includes('/member/reset-password')) {
      // Redirect bots to homepage if they try to access member areas
      const locale = pathname.startsWith('/tr') ? 'tr' : 'en';
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
    // Allow bots on all other routes without auth check
    return NextResponse.next();
  }

  // Public routes for normal users
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Auth protection for non-public routes (for normal users)
  await auth.protect();
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
