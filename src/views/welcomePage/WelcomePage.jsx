import React, { useContext, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { LoggedInContext } from 'contexts/login';
import { UserContext } from 'contexts/user';

import posed, { PoseGroup } from 'react-pose';

import MainDashboard from 'views/mainDashboard/MainDashboard';

const WelcomePose = posed.div({
  enter: { 
    opacity: 1,
    y: '0',
  },
  exit: { 
    opacity: 0,
    y: '-100%',
  },
});

const SlideInOut = posed.div({
  enter: { 
    opacity: 1,
    y: '0',
    delay: 300,
  },
  exit: { 
    opacity: 0,
    y: '-100%',
  },
});

export default function WelcomePage() {
  const { t } = useTranslation();
  const { state: { loggedIn } } = useContext(LoggedInContext);
  const { state: user } = useContext(UserContext);
 
  return (
    <div className="welcomePage box background">
      <div className="flex">
        <h2>{t('WelcomePage:Welcome')}&nbsp;</h2>
        <PoseGroup>
          {loggedIn ? (
            <SlideInOut key="username" initialPose="enter">
               <h2>{user.email}</h2>
              </SlideInOut>
            ) : (
            <SlideInOut key="toMealio" initialPose="exit">
              <h2>{t('WelcomePage:ToMealio')}</h2>
            </SlideInOut>
          )}
        </PoseGroup>
      </div>

      <div className="boxDivider" />

      <MainDashboard />
    </div>
  );
}
