import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  locale: string;
  breadcrumbs?: BreadcrumbItem[];
  bgImage?: string;
  variant?: 'default' | 'minimal' | 'gradient';
}

// Memoized breadcrumb component
const BreadcrumbItemComponent = React.memo(({ 
  item, 
  index, 
  breadcrumbs, 
  breadcrumbColor, 
  breadcrumbHoverColor, 
  isLightVariant 
}: {
  item: BreadcrumbItem;
  index: number;
  breadcrumbs: BreadcrumbItem[];
  breadcrumbColor: string;
  breadcrumbHoverColor: string;
  isLightVariant: boolean;
}) => {
  const isLast = index === breadcrumbs.length - 1;
  
  return (
    <li key={index}>
      <div className="flex items-center">
        <ChevronRight className={`w-4 h-4 ${breadcrumbColor}`} />
        {isLast ? (
          <span className={`ml-2 text-sm font-medium ${isLightVariant ? 'text-[#990000]' : 'text-white'}`}>
            {item.name}
          </span>
        ) : (
          <Link 
            href={item.href} 
            className={`ml-2 text-sm ${breadcrumbColor} hover:${breadcrumbHoverColor} transition-colors duration-200`}
          >
            {item.name}
          </Link>
        )}
      </div>
    </li>
  );
});
BreadcrumbItemComponent.displayName = 'BreadcrumbItem';

// Memoized stats component
const StatsSectionComponent = React.memo(({ 
  locale, 
  breadcrumbColor, 
  isLightVariant 
}: {
  locale: string;
  breadcrumbColor: string;
  isLightVariant: boolean;
}) => (
  <div className="mt-12 flex flex-wrap gap-8">
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${isLightVariant ? 'bg-[#990000]' : 'bg-white'}`}></div>
      <span className={`text-sm font-medium ${breadcrumbColor}`}>
        UNILAB Vision
      </span>
    </div>
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${isLightVariant ? 'bg-[#990000]/60' : 'bg-white/60'}`}></div>
      <span className={`text-sm ${breadcrumbColor}`}>
        {locale === 'tr' ? 'Geleceği Şekillendiriyoruz' : 'Shaping the Future'}
      </span>
    </div>
  </div>
));
StatsSectionComponent.displayName = 'StatsSection';

// Memoized contact section
const ContactSectionComponent = React.memo(({ locale }: { locale: string }) => (
  <section className="py-20 bg-white dark:bg-neutral-900">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="max-w-4xl">
        <div className="w-12 h-px bg-neutral-300 dark:bg-neutral-600 mb-8"></div>
        
        <div className="space-y-6">
          <h3 className="text-2xl font-light text-neutral-900 dark:text-neutral-100 tracking-wide">
            {locale === 'tr' ? 'Bizimle İletişime Geçin' : 'Get in Touch'}
          </h3>
          
          <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed max-w-2xl font-light">
            {locale === 'tr' 
              ? 'Projelerimiz hakkında daha fazla bilgi almak veya işbirliği yapmak için bizimle iletişime geçebilirsiniz.'
              : 'Contact us to learn more about our projects or to collaborate with us.'
            }
          </p>
          
          <div className="pt-4">
            <Link 
              href={`/${locale}/${locale === 'tr' ? 'iletisim' : 'contact'}`}
              className="inline-flex items-center text-neutral-900 dark:text-neutral-100 hover:text-[#990000] dark:hover:text-[#cc0000] transition-colors duration-200 group"
            >
              <span className="text-sm font-medium tracking-wide uppercase">
                {locale === 'tr' ? 'İletişim' : 'Contact'}
              </span>
              <ArrowLeft className="w-4 h-4 ml-3 rotate-180 transform group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
));
ContactSectionComponent.displayName = 'ContactSection';

export default function PageLayout({
  children,
  title,
  description,
  locale,
  breadcrumbs,
  bgImage,
  variant = 'default'
}: PageLayoutProps) {
  
  // Memoize background style calculation
  const backgroundStyle = useMemo(() => {
    if (bgImage) {
      return {
        backgroundImage: `linear-gradient(135deg, rgba(153, 0, 0, 0.9), rgba(153, 0, 0, 0.7)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      };
    }
    
    switch (variant) {
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #990000 0%, #660000 50%, #330000 100%)'
        };
      case 'minimal':
        return {
          background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #990000 0%, #770000 100%)'
        };
    }
  }, [bgImage, variant]);

  // Memoize color calculations
  const colorClasses = useMemo(() => {
    const isLightVariant = variant === 'minimal';
    return {
      isLightVariant,
      textColor: isLightVariant ? 'text-neutral-900' : 'text-white',
      descriptionColor: isLightVariant ? 'text-neutral-600' : 'text-neutral-200',
      breadcrumbColor: isLightVariant ? 'text-neutral-500' : 'text-neutral-300',
      breadcrumbHoverColor: isLightVariant ? 'text-neutral-700' : 'text-white'
    };
  }, [variant]);

  // Memoize breadcrumb home text
  const homeText = useMemo(() => locale === 'tr' ? 'Ana Sayfa' : 'Home', [locale]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero Banner Section */}
      <div 
        className="relative py-24 lg:py-32 overflow-hidden"
        style={backgroundStyle}
      >
        {/* Optimized decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
            style={{
              background: 'white',
              transform: 'translate(50%, -50%)',
              willChange: 'transform'
            }}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl"
            style={{
              background: 'white',
              transform: 'translate(-50%, 50%)',
              willChange: 'transform'
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          {breadcrumbs && (
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link 
                    href={`/${locale}`} 
                    className={`${colorClasses.breadcrumbColor} hover:${colorClasses.breadcrumbHoverColor} transition-colors duration-200 flex items-center text-sm font-medium`}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    {homeText}
                  </Link>
                </li>
                {breadcrumbs.map((item, index) => (
                  <BreadcrumbItemComponent
                    key={`breadcrumb-${index}`}
                    item={item}
                    index={index}
                    breadcrumbs={breadcrumbs}
                    breadcrumbColor={colorClasses.breadcrumbColor}
                    breadcrumbHoverColor={colorClasses.breadcrumbHoverColor}
                    isLightVariant={colorClasses.isLightVariant}
                  />
                ))}
              </ol>
            </nav>
          )}

          {/* Title and Description */}
          <div className="max-w-4xl">
            <div className="mb-6">
              <div className={`w-16 h-px ${colorClasses.isLightVariant ? 'bg-[#990000]' : 'bg-white'} mb-6`}></div>
              <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-light ${colorClasses.textColor} mb-6 leading-tight`}>
                {title}
              </h1>
            </div>
            
            {description && (
              <div className="max-w-3xl">
                <p className={`text-lg lg:text-xl ${colorClasses.descriptionColor} leading-relaxed`}>
                  {description}
                </p>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <StatsSectionComponent 
            locale={locale}
            breadcrumbColor={colorClasses.breadcrumbColor}
            isLightVariant={colorClasses.isLightVariant}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="relative">
        <div className="bg-white dark:bg-neutral-900">
          {children}
        </div>
      </main>

      {/* Contact Section */}
      <ContactSectionComponent locale={locale} />
    </div>
  );
}