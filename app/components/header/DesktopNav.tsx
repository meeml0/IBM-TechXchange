import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface DesktopNavProps {
  locale: string;
}

interface MenuItem {
  href: string;
  label: string;
}

export default function DesktopNav({ locale }: DesktopNavProps) {
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


  const items = menuItems[locale as keyof typeof menuItems] || menuItems.tr;

  return (
    <nav className="hidden lg:flex items-center space-x-10">
      {items.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}