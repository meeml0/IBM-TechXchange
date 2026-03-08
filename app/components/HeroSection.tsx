import React from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  TrendingDown, 
  Brain, 
  BarChart3, 
  ArrowRight,
  Globe2,
  Zap
} from 'lucide-react';

interface HeroSectionProps {
  locale?: string;
}

// İçerik çevirileri
const translations = {
  tr: {
    badge: 'AI Destekli Platform',
    title: 'Akıllı Karbon',
    titleAccent: 'Zekası',
    description: 'Karbon ayak izi analizi, akıllı öneriler ve sürdürülebilir iş dönüşümü için AI destekli platform.',
    stats: {
      emissionReduction: 'Emisyon Azaltımı',
      companies: 'Şirket',
      carbonSaved: 'tCO2 Tasarruf'
    },
    buttons: {
      startAnalysis: 'Analizi Başlat',
      viewDemo: 'Demo İzle'
    },
    trust: {
      globalStandards: 'Küresel Standartlar',
      realTimeProcessing: 'Gerçek Zamanlı İşlem'
    },
    dashboard: {
      title: 'Karbon Analitikleri',
      score: 'Karbon Performans Skoru',
      currentMonth: 'Bu Ay',
      reduction: 'Azalma',
      vsLastMonth: 'geçen aya göre',
      aiInsights: 'AI İçgörüleri',
      insight1: 'Enerji verimliliği optimizasyonu emisyonları %15 azaltabilir',
      insight2: 'Üretim için yenilenebilir enerji geçişini değerlendirin',
      live: 'Canlı',
      realTimeAnalysis: 'Gerçek Zamanlı Analiz'
    }
  },
  en: {
    badge: 'AI-Powered Platform',
    title: 'Smart Carbon',
    titleAccent: 'Intelligence',
    description: 'AI-driven platform for carbon footprint analysis, intelligent recommendations, and sustainable business transformation.',
    stats: {
      emissionReduction: 'Emission Reduction',
      companies: 'Companies',
      carbonSaved: 'tCO2 Saved'
    },
    buttons: {
      startAnalysis: 'Start Analysis',
      viewDemo: 'View Demo'
    },
    trust: {
      globalStandards: 'Global Standards',
      realTimeProcessing: 'Real-time Processing'
    },
    dashboard: {
      title: 'Carbon Analytics',
      score: 'Carbon Performance Score',
      currentMonth: 'Current Month',
      reduction: 'Reduction',
      vsLastMonth: 'vs last month',
      aiInsights: 'AI Insights',
      insight1: 'Energy efficiency optimization could reduce emissions by 15%',
      insight2: 'Consider renewable energy transition for production',
      live: 'Live',
      realTimeAnalysis: 'Real-time Analysis'
    }
  }
};

export default function CarbonHeroSection({ locale = 'tr' }: HeroSectionProps) {
  const t = translations[locale as keyof typeof translations] || translations.tr;

  return (
    <section className="relative py-24 bg-white dark:bg-neutral-900 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #000000 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      {/* Minimal Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-20 w-1 h-1 bg-emerald-500 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-40 left-16 w-1 h-1 bg-gray-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto relative">
        <div className="flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full">
            
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Minimal Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                <Brain className="w-3 h-3" />
                {t.badge}
              </div>

              {/* Clean Typography */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-light text-gray-900 dark:text-white leading-[0.9] tracking-tight">
                  {t.title}{' '}
                  <span className="relative">
                    {t.titleAccent}
                    <div className="absolute bottom-2 left-0 w-full h-0.5 bg-emerald-500 opacity-80"></div>
                  </span>
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg font-light">
                  {t.description}
                </p>
              </div>

              {/* Minimal Stats */}
              <div className="grid grid-cols-3 gap-8 py-8">
                <div className="text-center">
                  <div className="text-2xl font-light text-gray-900 dark:text-white">%40</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">{t.stats.emissionReduction}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-gray-900 dark:text-white">500+</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">{t.stats.companies}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-emerald-600">2.5M</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">{t.stats.carbonSaved}</div>
                </div>
              </div>

              {/* Clean CTA */}
              <div className="flex items-center gap-6">
                <Link 
                  href={`/${locale}/analyze`}
                  className="group flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300"
                >
                  {t.buttons.startAnalysis}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <Link 
                  href={`/${locale}/demo`}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-300"
                >
                  {t.buttons.viewDemo}
                </Link>
              </div>

              {/* Trust Line */}
              <div className="flex items-center gap-4 pt-4 text-xs text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-1">
                  <Globe2 className="w-3 h-3" />
                  {t.trust.globalStandards}
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {t.trust.realTimeProcessing}
                </div>
              </div>
            </div>

            {/* Right Column - Minimal Dashboard */}
            <div className="relative">
              {/* Main Interface */}
              <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm overflow-hidden">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded-sm flex items-center justify-center">
                        <Leaf className="w-3 h-3 text-white dark:text-gray-900" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{t.dashboard.title}</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  
                  {/* Score Display */}
                  <div className="text-center py-4">
                    <div className="text-4xl font-light text-gray-900 dark:text-white mb-2">8.2</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t.dashboard.score}</div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
                      <div className="bg-emerald-500 h-1 rounded-full transition-all duration-1000" style={{width: '82%'}}></div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-sm">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.dashboard.currentMonth}</div>
                      <div className="text-lg font-light text-gray-900 dark:text-white">1,247</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">tCO2</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-750 rounded-sm">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.dashboard.reduction}</div>
                      <div className="text-lg font-light text-emerald-600">%12.3</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t.dashboard.vsLastMonth}</div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.dashboard.aiInsights}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-750 rounded-sm">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {t.dashboard.insight1}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-750 rounded-sm">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {t.dashboard.insight2}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Status */}
              <div className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{t.dashboard.live}</span>
                </div>
              </div>

              <div className="absolute -bottom-3 -left-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm px-3 py-2 shadow-sm">
                <div className="text-xs font-medium">{t.dashboard.realTimeAnalysis}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
    </section>
  );
}