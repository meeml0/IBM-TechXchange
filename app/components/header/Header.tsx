//app/components/header/Header.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Leaf, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import LanguageSwitcher from '../LanguageSwitcher';
import { getUnilabBlogPostBySlug, getUnilabBlogPostAlternateSlug } from '@/app/services/unilabBlogService';

interface HeaderProps {
  primary?: string;
  locale: string;
}

type SupportedLocale = 'tr' | 'en';

export default function Header({ primary = '#22c55e', locale }: HeaderProps) {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [blogPostAlternateSlug, setBlogPostAlternateSlug] = useState<string | null>(null);

  // Handle theme detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const isDark =
        savedTheme === 'dark' ||
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', isDark);
      setIsDarkMode(isDark);
    }
  }, []);

  // Handle scroll effect with debounce
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsScrolled(window.scrollY > 20), 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Check if current page is a blog post and get alternate slug
  useEffect(() => {
    const checkBlogPostAlternate = async () => {
      try {
        const segments = pathname.split('/');
        const currentLocale = segments[1] as SupportedLocale;
        const isBlogPost = segments.length >= 4 && segments[2] === 'blog' && segments[3];
        
        if (isBlogPost) {
          const slug = segments[3];
          
          // Get current post to find its ID
          const currentPost = await getUnilabBlogPostBySlug(slug, currentLocale);
          
          if (currentPost) {
            const targetLocale = currentLocale === 'tr' ? 'en' : 'tr';
            const alternateSlug = await getUnilabBlogPostAlternateSlug(currentPost.id, targetLocale);
            setBlogPostAlternateSlug(alternateSlug);
          } else {
            setBlogPostAlternateSlug(null);
          }
        } else {
          setBlogPostAlternateSlug(null);
        }
      } catch (error) {
        console.error('Error checking blog post alternate:', error);
        setBlogPostAlternateSlug(null);
      }
    };

    checkBlogPostAlternate();
  }, [pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  // User Authentication Component
  const UserAuth = () => {
    if (isSignedIn) {
      return (
        <div className="flex items-center space-x-3">
          {/* User greeting - only on desktop */}
          <span className="hidden md:block text-sm text-neutral-600 dark:text-neutral-400">
            {locale === 'tr' ? 'Merhaba' : 'Hello'}, {user.firstName || user.username}
          </span>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 ring-2 ring-green-500/20 hover:ring-green-500/40 transition-all duration-200",
                userButtonTrigger: "hover:opacity-80 transition-opacity duration-200"
              }
            }}
            afterSignOutUrl={`/${locale}`}
          />
        </div>
      );
    }

    return (
      <SignInButton mode="modal">
        <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-green-600 dark:hover:text-green-400 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-green-500/50 dark:hover:border-green-400/50 transition-all duration-200 group">
          <User className="w-4 h-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200" />
          <span>{locale === 'tr' ? 'Giriş Yap' : 'Sign In'}</span>
        </button>
      </SignInButton>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 backdrop-blur-md z-50 transition-all duration-300
        ${isScrolled ? 'bg-[#fff] dark:bg-neutral-900/95 shadow-sm py-3' : 'bg-[#fff] dark:bg-neutral-900/80 py-5'} 
        border-b border-neutral-200 dark:border-neutral-800`}
      style={{ '--primary': primary } as React.CSSProperties}
    >
      <div className="max-w-full mx-auto px-6 sm:px-6 md:px-8 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href={`/${locale}`} prefetch className="transition-all duration-300 flex items-center group">
          <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-500 mr-2 md:mr-3 group-hover:text-green-400 transition-colors duration-300" />
          <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent group-hover:from-green-400 group-hover:to-emerald-500 transition-all duration-300">
            UNIGREEN
          </div>
        </Link>

        {/* Desktop Navigation and Actions */}
        <div className="flex items-center space-x-5">
          <DesktopNav locale={locale} />
          <div className="hidden lg:flex items-center space-x-5">
            <SearchBar locale={locale} />
            <LanguageSwitcher blogPostAlternateSlug={blogPostAlternateSlug} />
            <ThemeToggle 
              isDarkMode={isDarkMode} 
              setIsDarkMode={handleThemeToggle}
            />
            {/* User Authentication - Desktop */}
            <UserAuth />
          </div>
          <div className="lg:hidden flex items-center space-x-4">
            <LanguageSwitcher mobile blogPostAlternateSlug={blogPostAlternateSlug} />
            <ThemeToggle 
              isDarkMode={isDarkMode} 
              setIsDarkMode={handleThemeToggle}
            />
            {/* User Authentication - Mobile */}
            <div className="flex items-center">
              <UserAuth />
            </div>
            <button
              className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-label={locale === 'tr' ? 'Menüyü aç/kapat' : 'Toggle menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && <MobileNav toggleMobileMenu={toggleMobileMenu} locale={locale} />}
    </header>
  );
}