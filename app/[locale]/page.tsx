// app/[locale]/page.tsx
import HeroSection from '../components/HeroSection';
import InsightSection from '../components/InsightSection';

// Interface for component props
interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'tr';

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <HeroSection locale={locale} />
      </div>
      
      {/* Insight Section with Green Background */}
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/70 via-green-50/60 to-gray-50/80 dark:from-emerald-950/50 dark:via-green-950/40 dark:to-gray-900/70"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <InsightSection locale={locale} />
        </div>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return [
    { locale: 'tr' },
    { locale: 'en' },
  ];
}
