// /app/[locale]/analyze/page.tsx
import AnalyzePage from './AnalyzePage'; // veya doğru path

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function AnalyzeDashboard({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || 'tr';
  
  return <AnalyzePage locale={locale as 'tr' | 'en'} />;
}