import './logo.css';

import { Link } from 'react-router-dom';

import React from 'react';

export default function Logo() {
  return (
    <Link to="/" className="logo mainSideMenu">
      <h2 className="logoTitle background flex vcenter center">Mealio</h2>
    </Link>
  );
}
