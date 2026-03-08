'use client';

import Link from "next/link";
import MobileSearchBar from './MobileSearchbar';
import { useUser } from '@clerk/nextjs';

interface MobileNavProps {
  toggleMobileMenu: () => void;
  locale: string;
}

interface MenuItem {
  href: string;
  label: string;
}

export default function MobileNav({ toggleMobileMenu, locale }: MobileNavProps) {
  const { isSignedIn } = useUser();

  const menuItems: Record<string, MenuItem[]> = {
    tr: [
      { href: `/${locale}/`, label: "Ana Sayfa" },
      { href: `/${locale}/analyze`, label: "Analiz Et" },
      { href: `/${locale}/iletisim`, label: "İletişim" },
    ],
    en: [
      { href: `/${locale}/`, label: "Home" },
      { href: `/${locale}/analyze`, label: "Analyze" },
      { href: `/${locale}/contact`, label: "Contact" },
    ],
  };

  // Add panel link if user is signed in
  if (isSignedIn) {
    menuItems.tr.push({ href: `/${locale}/member`, label: "Panelim" });
    menuItems.en.push({ href: `/${locale}/member`, label: "My Panel" });
  }

  const items = menuItems[locale as keyof typeof menuItems] || menuItems.tr;

  return (
    <div className="lg:hidden bg-[#fff] min-h-screen dark:bg-neutral-900 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 absolute top-full left-0 right-0 z-40 animate-slideDown shadow-lg">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex flex-col space-y-5">
        {/* Mobile Search Bar */}
        <div className="mb-4">
          <MobileSearchBar locale={locale} />
        </div>

        {/* Menu Items */}
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors duration-200"
            onClick={toggleMobileMenu}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}