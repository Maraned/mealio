import React, { useContext } from 'react';

import Header from 'views/header/Header';
import { LoggedInProvider, LoggedInContext } from 'contexts/login';
import { GunProvider } from 'contexts/gun';

import MainView from 'views/MainView';

import './App.css';


const App = () => {
  // const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token'));

  return (
    <LoggedInProvider>
      <GunProvider>
        <Header />

        <MainView />
      </GunProvider>
    </LoggedInProvider>
  )
}

export default App;
