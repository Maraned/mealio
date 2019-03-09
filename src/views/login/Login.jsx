import React, { useState, useRef, useEffect, useContext } from 'react';
import posed from 'react-pose';
import { useTranslation } from 'react-i18next';
import { LoggedInContext } from 'contexts/login';
import { setTokens } from 'utils/token';

import './login.css';

const Login = () => {
  const { t, i18n } = useTranslation();
  const [popupOpen, setPopupOpen] = useState(false);
  const popupNode = useRef(null);
  const [username, setUsername] = useState('master');
  const [password, setPassword] = useState('trader');
  const { dispatch } = useContext(LoggedInContext);
  console.log('dispatch', dispatch)
 
  const handleClick = event => {
    if (popupOpen) {
      if (popupNode.current 
        && !popupNode.current.contains(event.target)
      ) {
        setPopupOpen(false);
        event.target.click();
      }
    }
  }

  const Box = posed.div({
    visible: { 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 0
      } 
    },
    hidden: { 
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 0
      } 
    }
  });

  const submitLogin = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch('/login', {
      method: 'post',
      body: formData
    });

    switch(response.status) {
      case 200: 
        const responseData = await response.json();
        setTokens(responseData);
        dispatch({ type: 'login' });
      default: 
        return;
    }
  }
  
  useEffect(() => {
    document.addEventListener('click', handleClick, false);

    return () => document.removeEventListener('click', handleClick, false);
  });
  
  return (
    <div className="login">
      <button 
        onClick={() => setPopupOpen(!popupOpen)}
      >
        {t('Login.login')}
      </button>

      <Box
        ref={popupNode}
        pose={popupOpen ? 'visible' : 'hidden'}
        className="login__popup"
      >
        <input 
          value={username} 
          onChange={event => setUsername(event.target.value)}
          placeholder={t('Login.username')} 
        /> 
        <input 
          value={password} 
          onChange={event => setPassword(event.target.value)} 
          placeholder={t('Login.password')} 
        /> 

        <button onClick={submitLogin}>
          {t('Login.login')}
        </button>
      </Box>
    </div>
  )
}

export default Login;
