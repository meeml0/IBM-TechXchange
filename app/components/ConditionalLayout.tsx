'use client';

import { usePathname } from 'next/navigation';
import Header from "./header/Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

interface ConditionalLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function ConditionalLayout({ children, locale }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminPage = 
    pathname?.includes(`/${locale}/member/signup`) ||
    pathname?.includes(`/${locale}/member/login`) ||
    pathname?.includes(`/${locale}/member`);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Header locale={locale} />}
      <div className={`flex-grow ${isAdminPage ? '' : 'mt-[75px]'}`}>
        {children}
      </div>
      {!isAdminPage && <Footer locale={locale} />}
      {!isAdminPage && <BackToTop />}
    </div>
  );
}