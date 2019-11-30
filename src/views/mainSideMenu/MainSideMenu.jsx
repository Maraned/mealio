import './mainSideMenu.css';

import React, { useContext } from 'react';

import ProfileSection from './ProfileSection';
import LogInSection from './LogInSection';

import { LoggedInContext } from 'contexts/login';

export default function MainSideMenu({

}) {
  const { state } = useContext(LoggedInContext);

  return (
    <div className="mainSideMenu">
      {state.loggedIn ? (
        <ProfileSection />
      ) : (
        <LogInSection />
      )}
    </div>
  )
}