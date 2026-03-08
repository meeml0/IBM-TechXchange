import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Instagram, Mail } from 'lucide-react';
import XIcon from './XIcon'; // Import the new XIcon component

interface FooterProps {
  locale: string;
}

const Footer = ({ locale }: FooterProps) => {
  // Language-based content
  const content = {
    tr: {
      description: "UNIGREENAI, yapay zeka teknolojileri ile şirketlerin karbon ayak izlerini analiz ederek sürdürülebilir bir gelecek için çözümler sunan öncü bir platformdur. Daha yeşil bir dünya için işletmeleri karbon nötr olmaya yönlendiriyoruz.",
      copyright: `© ${new Date().getFullYear()} UNIGREENAI. Tüm hakları saklıdır.`,
      privacyPolicy: "Gizlilik Politikası",
      termsOfService: "Kullanım Koşulları",
      mainLinks: [
        {
          title: 'UNIGREENAI',
          items: [
            { label: 'Ana Sayfa', href: `/${locale}` },
            { label: 'Analiz Et', href: `/${locale}/analiz` },
            { label: 'İletişim', href: `/${locale}/iletisim` },
          ],
        },
        {
          title: 'Çözümlerimiz',
          items: [
            { label: 'Karbon Ayak İzi Analizi', href: `/${locale}/analiz` },
            { label: 'AI Destekli Raporlama', href: `/${locale}/analiz` },
            { label: 'Sürdürülebilirlik Danışmanlığı', href: `/${locale}/iletisim` },
          ],
        },
        {
          title: 'Teknolojilerimiz',
          items: [
            { label: 'Yapay Zeka', href: `/${locale}/analiz` },
            { label: 'Veri Analizi', href: `/${locale}/analiz` },
            { label: 'Çevre Modelleme', href: `/${locale}/analiz` },
            { label: 'Emisyon Takibi', href: `/${locale}/analiz` },
          ],
        },
        {
          title: 'Bize Katılın',
          items: [
            { label: 'Ücretsiz Analiz Başlatın', href: `/${locale}/analiz` },
            { label: 'Demo Talep Edin', href: `/${locale}/iletisim` },
            { label: 'Ortaklık', href: `/${locale}/iletisim` },
          ],
        },
      ],
    },
    en: {
      description: "UNIGREENAI is a pioneering platform that uses artificial intelligence technologies to analyze companies' carbon footprints and provides solutions for a sustainable future. We guide businesses towards carbon neutrality for a greener world.",
      copyright: `© ${new Date().getFullYear()} UNIGREENAI. All rights reserved.`,
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      mainLinks: [
        {
          title: 'UNIGREENAI',
          items: [
            { label: 'Home', href: `/${locale}` },
            { label: 'Analyze', href: `/${locale}/analyze` },
            { label: 'Contact', href: `/${locale}/contact` },
          ],
        },
        {
          title: 'Our Solutions',
          items: [
            { label: 'Carbon Footprint Analysis', href: `/${locale}/analyze` },
            { label: 'AI-Powered Reporting', href: `/${locale}/analyze` },
            { label: 'Sustainability Consulting', href: `/${locale}/contact` },
          ],
        },
        {
          title: 'Our Technologies',
          items: [
            { label: 'Artificial Intelligence', href: `/${locale}/analyze` },
            { label: 'Data Analytics', href: `/${locale}/analyze` },
            { label: 'Environmental Modeling', href: `/${locale}/analyze` },
            { label: 'Emission Tracking', href: `/${locale}/analyze` },
          ],
        },
        {
          title: 'Join Us',
          items: [
            { label: 'Start Free Analysis', href: `/${locale}/analyze` },
            { label: 'Request Demo', href: `/${locale}/contact` },
            { label: 'Partnership', href: `/${locale}/contact` },
          ],
        },
      ],
    },
  };

  // Safely retrieve content (fall back to Turkish if locale is unsupported)
  const t = locale in content ? content[locale as keyof typeof content] : content.tr;

  // Social media links with locale-based handles
  const socialLinks = [
    { icon: Mail, href: 'mailto:info@unigreenai.com', label: 'Email' },
    {
      icon: Instagram,
      href: locale === 'tr' ? 'https://instagram.com/unigreenaitr' : 'https://instagram.com/unigreenai',
      label: 'Instagram',
    },
    {
      icon: Linkedin,
      href: locale === 'tr' ? 'https://linkedin.com/company/unigreenaitr' : 'https://linkedin.com/company/unigreenai',
      label: 'LinkedIn',
    },
    {
      icon: XIcon,
      href: locale === 'tr' ? 'https://x.com/unigreenaitr' : 'https://x.com/unigreenai',
      label: 'X',
    },
  ];

  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-neutral-300 py-16 px-6">
      <div className="container mx-auto max-w-full lg:max-w-[1400px] xl:max-w-[1800px] 2xl:max-w-[2000px]">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-8 lg:gap-12 xl:gap-16">
          {/* Brand Section */}
          <div className="md:col-span-3 lg:col-span-4 xl:col-span-4">
            <Link href={`/${locale}`} className="block mb-4">
              <div className="text-2xl font-bold text-green-400">
                UNIGREEN
              </div>
            </Link>
            <p className="mt-4 text-md leading-relaxed text-neutral-400">
              {t.description}
            </p>
            <div className="mt-6 flex space-x-5">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-green-400 dark:hover:text-green-300 transition-colors duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {t.mainLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-md font-medium text-neutral-100 mb-5">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-400 hover:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-neutral-800">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <p className="text-neutral-500 text-sm text-center md:text-left">
                {t.copyright}
              </p>
            </div>
            <div className="flex space-x-6 mt-4 lg:mt-0">
              <Link 
                href={locale === 'tr' ? '/tr/gizlilik' : '/en/privacy'} 
                className="text-neutral-500 hover:text-green-400 dark:hover:text-green-300 transition-colors duration-200 text-sm"
              >
                {t.privacyPolicy}
              </Link>
              <Link 
                href={locale === 'tr' ? '/tr/sartlar-ve-kosullar' : '/en/terms'} 
                className="text-neutral-500 hover:text-green-400 dark:hover:text-green-300 transition-colors duration-200 text-sm"
              >
                {t.termsOfService}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;