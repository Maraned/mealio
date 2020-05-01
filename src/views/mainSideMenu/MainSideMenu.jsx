import './mainSideMenu.css';

import React, { useContext } from 'react';

import ProfileSection from './ProfileSection';
import LogInSection from './LogInSection';
import AdminSection from './AdminSection';

import { LoggedInContext } from 'contexts/login';
import { UserContext } from 'contexts/user';

export default function MainSideMenu() {
  const { state } = useContext(LoggedInContext);
  const { state: user } = useContext(UserContext);

  return (
    <div className="mainSideMenu">
      {state.loggedIn ? (
        <>
        <ProfileSection />
        
        {user.isAdmin && (
          <AdminSection />
        )}
        </>
      ) : (
        <LogInSection />
      )}
    </div>
  )
}