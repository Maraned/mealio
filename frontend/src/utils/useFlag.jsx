import { useMemo } from 'react';
import Flags from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';

const useFlag = () => {
  const { i18n } = useTranslation();

  const flagLocale = useMemo(() => {
    return i18n.language.split('-')[1]?.toUpperCase();
  }, [i18n]);

  return Flags[flagLocale] || '';
}

export default useFlag;
