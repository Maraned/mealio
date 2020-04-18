import React, { useState, useEffect } from 'react';

import { useTranslation, Trans } from 'react-i18next';

export default function Author({ author, authorUrl, origin, originUrl }) {
  const { t } = useTranslation();
  const [displayMode, setDisplayMode] = useState('');

  const renderAuthorUrlWithOriginUrl = () => (
    <Trans i18nKey="Recipe:AuthorUrlWithOriginUrl">
      <a href={authorUrl} target="_blank">{'&nbsp;'}{{author}}</a> <a href={originUrl} target="_blank">{' '}{{origin}}</a>
    </Trans>
  );

  const renderAuthorUrl = () => (
    <Trans i18nKey="Recipe:AuthorUrl">
      <a href={authorUrl} target="_blank">{' '}{{author}}</a>
    </Trans>
  );

  const renderAuthorWithOriginUrl = () => (
    <Trans i18nKey="Recipe:AuthorWithOrigin">
     {{author}} <a href={originUrl} target="_blank">{' '}{{origin}}</a>
    </Trans>
  );

  const renderWithoutUrls = () => t('Recipe:Author', { author });

  useEffect(() => {
    if (!author) {
      return;
    }

    const authorUrlWithOriginUrl = author && authorUrl && origin && originUrl;
    if (authorUrlWithOriginUrl) {
      return setDisplayMode('authorUrlWithOriginUrl');
    }

    const authorWithUrl = author && authorUrl;
    if (authorWithUrl) {
      return setDisplayMode('authorWithUrl');      
    }

    const originWithUrl = origin && originUrl;
    if (originWithUrl) {
      return setDisplayMode('authorWithOrigin');
    }
    return setDisplayMode('');
  }, [author, authorUrl, origin, originUrl]);

  const getView = () => {
    switch (displayMode) {
      case 'authorUrlWithOriginUrl': return renderAuthorUrlWithOriginUrl();
      case 'authorUrl': return renderAuthorUrl();
      case 'authorWithOrigin': return renderAuthorWithOriginUrl();
      default: return renderWithoutUrls();
    }
  }

  return (
    <div className="preserveWhitespace">
      {getView()}
    </div>
  );
} 
