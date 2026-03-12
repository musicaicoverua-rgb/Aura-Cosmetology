import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language;

  const changeLanguage = useCallback(
    (langCode: string) => {
      i18n.changeLanguage(langCode);
      localStorage.setItem('i18nextLng', langCode);
    },
    [i18n]
  );

  const getCurrentLanguage = useCallback(() => {
    return (
      languages.find((lang) => lang.code === currentLanguage) || languages[0]
    );
  }, [currentLanguage]);

  return {
    t,
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
    languages,
  };
};