import React, { useContext } from 'react';

import { RouterContext } from 'contexts/router';
import Modal from 'components/modal/Modal';

import './mainView.css';

const MainView = () => {
  const { state: router } = useContext(RouterContext);
  const { ActiveView } = router;

  return (
    <div className="mainView">
      {ActiveView && (
        <ActiveView />
      )}

      <Modal />
    </div>
  )
}

export default MainView;
