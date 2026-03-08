import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface InsightSectionProps {
  locale: string;
}

// In real application, this data would be fetched from database
async function getInsightContent(locale: string) {
  return {
    title: locale === 'tr' 
      ? "Karbon Zekası ile Geleceği Şekillendirin"
      : "Shape the Future with Carbon Intelligence",
    description: locale === 'tr'
      ? "AI destekli karbon analiz platformumuz ile şirketinizin sürdürülebilirlik yolculuğuna başlayın. Gerçek zamanlı veri analizi, akıllı öneriler ve kapsamlı raporlama özellikleriyle karbon ayak izinizi optimize edin."
      : "Begin your company's sustainability journey with our AI-powered carbon analysis platform. Optimize your carbon footprint with real-time data analysis, intelligent recommendations, and comprehensive reporting features.",
    primaryButtonText: locale === 'tr' ? "Demo Talep Et" : "Request Demo",
    secondaryButtonText: locale === 'tr' ? "Detayları İncele" : "Learn More",
    primaryButtonLink: "/demo",
    secondaryButtonLink: locale === 'tr' ? "/ozellikler" : "/features",
    trustElements: {
      iso: {
        title: "ISO 14064",
        subtitle: locale === 'tr' ? "Sertifikalı Standartlar" : "Certified Standards"
      },
      uptime: {
        title: "99.9%",
        subtitle: locale === 'tr' ? "Uptime Garantisi" : "Uptime Guarantee"
      },
      monitoring: {
        title: "24/7",
        subtitle: locale === 'tr' ? "Gerçek Zamanlı İzleme" : "Real-time Monitoring"
      }
    }
  };
}

export default async function InsightSection({ locale }: InsightSectionProps) {
  try {
    const content = await getInsightContent(locale);
    
    return (
      <section className="relative w-full py-24 overflow-hidden ">
        {/* Subtle Pattern Background */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 75%, #000000 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>

        {/* Minimal Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
        
        {/* Content */}
        <div className="container relative z-10 mx-auto ">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 dark:text-white mb-8 leading-tight tracking-tight">
              {content.title}
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 leading-relaxed font-light">
              {content.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={content.primaryButtonLink}
                className="group inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-8 rounded-sm transition-all duration-300 text-base font-medium hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                <span className="transition-transform duration-300">{content.primaryButtonText}</span>
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>
              
              <Link 
                href={content.secondaryButtonLink}
                className="inline-flex items-center justify-center bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white py-3 px-8 rounded-sm transition-all duration-300 text-base font-medium"
              >
                {content.secondaryButtonText}
              </Link>
            </div>

            {/* Trust Elements */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900 dark:text-white mb-1">{content.trustElements.iso.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{content.trustElements.iso.subtitle}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900 dark:text-white mb-1">{content.trustElements.uptime.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{content.trustElements.uptime.subtitle}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-emerald-600 mb-1">{content.trustElements.monitoring.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{content.trustElements.monitoring.subtitle}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
      </section>
    );
  } catch (error) {
    console.error('Failed to load insight content:', error);
    return (
      <section className="py-16 lg:py-20 relative bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {locale === 'tr' ? 'İçerik yüklenirken bir hata oluştu. Lütfen tekrar deneyin.' : 'Failed to load content. Please try again.'}
            </p>
          </div>
        </div>
      </section>
    );
  }
}