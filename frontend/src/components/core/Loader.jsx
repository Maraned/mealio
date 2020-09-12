import React from 'react';

import LogoIcon from 'components/core/LogoIcon';

export default function Loader({ size }) {
  return (
    <div className="loader">
      <LogoIcon animate size={size} />
    </div>
  );
}
