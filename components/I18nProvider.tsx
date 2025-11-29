'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize i18n
    i18n.changeLanguage(localStorage.getItem('i18nextLng') || 'en').then(() => {
      setIsInitialized(true);
    });

    // Update document direction when language changes
    const handleLanguageChanged = (lng: string) => {
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="spinner"></div>
    </div>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
