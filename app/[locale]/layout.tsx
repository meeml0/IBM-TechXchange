import type { Metadata } from "next";
import { Syne } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import ConditionalLayout from "../components/ConditionalLayout";
import CookieBanner from "../components/CookieBanner"; // Cookie Banner import
import "../globals.css";
import Script from "next/script";

// Font definitions
const syneSans = Syne({
  variable: "--font-syne-sans",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Generate metadata function - Fixed type signature
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'tr';
  
  // If you need pathname, you can get it from searchParams or use a different approach
  // For now, we'll construct URLs without the pathname parameter
  const canonicalUrl = `https://unigreen.ai/${locale}`;
  const trPath = `https://unigreen.ai/tr`;
  const enPath = `https://unigreen.ai/en`;

  return {
    title: locale === 'tr'
      ? "UNIGREEN | AI Destekli Karbon Ayak İzi Analiz Platformu"
      : "UNIGREEN | AI-Powered Carbon Footprint Analysis Platform",
    description: locale === 'tr'
      ? "UNIGREEN, yapay zeka destekli karbon ayak izi analizi, sürdürülebilirlik raporlama ve çevre dostu iş stratejileri geliştiren platform."
      : "UNIGREEN, an AI-powered platform for carbon footprint analysis, sustainability reporting, and developing eco-friendly business strategies.",
    keywords: locale === 'tr'
      ? [
          "UNIGREEN",
          "karbon ayak izi",
          "sürdürülebilirlik",
          "AI analiz",
          "çevre platformu",
          "karbon emisyonu",
          "yeşil teknoloji",
          "ESG raporlama"
        ]
      : [
          "UNIGREEN",
          "carbon footprint",
          "sustainability",
          "AI analysis",
          "environmental platform",
          "carbon emissions",
          "green technology",
          "ESG reporting"
        ],
    authors: [{ name: "UNIGREEN" }],
    robots: "index, follow",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'tr': trPath,
        'en': enPath,
      },
    },
    openGraph: {
      title: locale === 'tr'
        ? "UNIGREEN | AI Destekli Karbon Ayak İzi Analiz Platformu"
        : "UNIGREEN | AI-Powered Carbon Footprint Analysis Platform",
      description: locale === 'tr'
        ? "UNIGREEN, yapay zeka destekli karbon ayak izi analizi, sürdürülebilirlik raporlama ve çevre dostu iş stratejileri geliştiren platform."
        : "UNIGREEN, an AI-powered platform for carbon footprint analysis, sustainability reporting, and developing eco-friendly business strategies.",
      url: canonicalUrl,
      siteName: "UNIGREEN",
      images: [
        {
          url: "https://unigreen.ai/og-image.jpg",
          width: 1200,
          height: 630,
          alt: locale === 'tr' ? "UNIGREEN Platform Görseli" : "UNIGREEN Platform Image",
        },
      ],
      locale: locale === 'tr' ? "tr_TR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: locale === 'tr'
        ? "UNIGREEN | AI Destekli Karbon Ayak İzi Analiz Platformu"
        : "UNIGREEN | AI-Powered Carbon Footprint Analysis Platform",
      description: locale === 'tr'
        ? "UNIGREEN, yapay zeka destekli karbon ayak izi analizi, sürdürülebilirlik raporlama ve çevre dostu iş stratejileri geliştiren platform."
        : "UNIGREEN, an AI-powered platform for carbon footprint analysis, sustainability reporting, and developing eco-friendly business strategies.",
      images: ["https://unigreen.ai/twitter-image.jpg"],
    },
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "UNIGREEN",
        url: canonicalUrl,
        logo: "https://unigreen.ai/logo.png",
        description: locale === 'tr'
          ? "UNIGREEN, yapay zeka destekli karbon ayak izi analizi, sürdürülebilirlik raporlama ve çevre dostu iş stratejileri geliştiren platform."
          : "UNIGREEN, an AI-powered platform for carbon footprint analysis, sustainability reporting, and developing eco-friendly business strategies.",
        sameAs: [
          "https://twitter.com/unigreen",
          "https://linkedin.com/company/unigreen",
        ],
      }),
    },
  };
}

// Viewport export
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Static parameters
export function generateStaticParams() {
  return [
    { locale: 'tr' },
    { locale: 'en' },
  ];
}

// Layout component
export default async function LocaleLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'tr';
  
  return (
    <html lang={locale} dir="ltr" className={`${syneSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://clerk.com" />
        
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W94586N6');
          `}
        </Script>
        
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rx8jtq7mkd");
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-[#fff] dark:bg-neutral-900">
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-W94586N6"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          ></iframe>
        </noscript>
        
        <ClerkProvider>
          <ConditionalLayout locale={locale}>
            {children}
          </ConditionalLayout>
          <CookieBanner locale={locale} />
        </ClerkProvider>
      </body>
    </html>
  );
}