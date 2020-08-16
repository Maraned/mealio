import React, { useState, useEffect } from 'react';

import { useTranslation, Trans } from 'react-i18next';

export default function Author({
  authorUser,
  originalAuthorUser,
  authorUrl,
  origin,
  originUrl
}) {
  const { t } = useTranslation();
  const [displayMode, setDisplayMode] = useState('');

  console.log('authorUser', authorUser)

  const renderOriginalAuthor = () => {
    const author = originalAuthorUser?.displayName;
    return (
      <Trans i18nKey="Recipe:OriginalAuthor">
        <a href={authorUrl} target="_blank">{'&nbsp;'}{{author}}</a> <a href={originUrl} target="_blank">{' '}{{origin}}</a>
      </Trans>
    );
  };

  const renderAuthor = () => {
    const author = authorUser?.displayName;
    return (
      <Trans i18nKey="Recipe:Author">
        <a href={authorUrl} target="_blank">{'&nbsp;'}{{author}}</a> <a href={originUrl} target="_blank">{' '}{{origin}}</a>
      </Trans>
    );
  }

  // const renderAuthorUrl = () => (
  //   <Trans i18nKey="Recipe:AuthorUrl">
  //     <a href={authorUrl} target="_blank">{' '}{{authorUser.displayName}}</a>
  //   </Trans>
  // );

  // const renderAuthorWithOriginUrl = () => (
  //   <Trans i18nKey="Recipe:AuthorWithOrigin">
  //    {authorUser} <a href={originUrl} target="_blank">{' '}{{origin}}</a>
  //   </Trans>
  // );

  useEffect(() => {
    if (!authorUser) {
      return;
    }

    const authorUrlWithOriginUrl = authorUser && authorUrl && origin && originUrl;
    if (authorUrlWithOriginUrl) {
      return setDisplayMode('authorUrlWithOriginUrl');
    }

    const authorWithUrl = authorUser && authorUrl;
    if (authorWithUrl) {
      return setDisplayMode('authorWithUrl');
    }

    const originWithUrl = origin && originUrl;
    if (originWithUrl) {
      return setDisplayMode('authorWithOrigin');
    }
    return setDisplayMode('');
  }, [authorUser, authorUrl, origin, originUrl]);

  return (
    <>
      <div className="preserveWhitespace margin--top">
        {renderOriginalAuthor()}
      </div>
      <div className="preserveWhitespace margin--top--small">
        {renderAuthor()}
      </div>
    </>
  );
}
