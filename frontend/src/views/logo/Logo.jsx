import './logo.css';

import { Link } from 'react-router-dom';

import React, { useState, useEffect } from 'react';

import LogoIcon from 'components/core/LogoIcon';
import useHover from 'utils/useHover';

export default function Logo() {
  const [hoverRef, isHovered] = useHover();
  const [hasHoveredOnce, setHasHoveredOnce] = useState(false);

  useEffect(() => {
    if (!hasHoveredOnce && isHovered) {
      setHasHoveredOnce(true);
    }
  }, [hasHoveredOnce, isHovered])


  return (
    <Link to="/" className="background logo mainSideMenu flex vcenter center" ref={hoverRef}>
      <LogoIcon animateOnce animate={hasHoveredOnce} pauseAnimation={hasHoveredOnce && !isHovered} />
      <h2 className="logoTitle flex vcenter center">Mealio</h2>
    </Link>
  );
}
