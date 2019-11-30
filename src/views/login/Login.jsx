import React, { useState, useRef, useEffect, useContext } from 'react';
import { LoggedInContext } from 'contexts/login';
import { UserContext } from 'contexts/user';
import { PendingRequestContext } from 'contexts/pendingRequests';

import { useTranslation } from 'react-i18next';

import { postRequest } from 'utils/request';

import './login.css';

const Login = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const popupNode = useRef(null);
  const [email, setEmail] = useState('a@b.com');
  const [password, setPassword] = useState('a@b.com');
  const { dispatch } = useContext(LoggedInContext);
  const { state, dispatch: userDispatch } = useContext(UserContext);
  const { 
    state: pendingRequestState, 
    dispatch: pendingRequestDispatch 
  } = useContext(PendingRequestContext);
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState('login');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (state.user && state.user.is) {
      dispatch({ type: 'login' })
    }
  }, [state.user]);
  
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

  const handleLoginResponse = ({ 
    accessToken, 
    refreshToken,
    currentUserValue,
    user
  }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('currentUserValue', currentUserValue);
    localStorage.setItem('refreshToken', refreshToken);
    if (user) {
      localStorage.setItem('email', user.email);
      userDispatch({ type: 'user', value: user });
    }

    dispatch({ type: 'login' });
  }

  const authenticateUser = async () => {
    const response = await postRequest('login', {
      credentials: btoa(`${email}:${password}`)
    });

    if (response.error) {
      setError(t(`Login:${response.error}`));
    } else  {
      handleLoginResponse(response);
    }
  }

  const submitLogin = async (callback) => {
    authenticateUser();
  }

  const validEmail = email => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(emailRegex);
  }

  const submitRegister = async event => {
    event.preventDefault(); 
    if (validEmail(email)) {
      const response = await postRequest('users/create', {
        email,
        password
      });

      if (response.error) {
        setError(t(`Login:${response.error}`));
      } else {
        handleLoginResponse(response);
      }
    } else {
      setError(t('Login:InvalidEmailFormat'));
    }
  }
  
  useEffect(() => {
    document.addEventListener('click', handleClick, false);

    return () => document.removeEventListener('click', handleClick, false);
  });

  const changeView = view => () => {
    setError('');
    setActiveView(view);
  };

  const renderForm = ({ 
    onClick, 
    onClickChangeView,
    key, 
    btnText, 
    changeViewText 
  }) => (
    <>
      <input 
        type="email"
        value={email} 
        onChange={event => setEmail(event.target.value)}
        placeholder={t('Login:username')} 
      /> 
      <input 
        type="password"
        value={password} 
        onChange={event => setPassword(event.target.value)} 
        placeholder={t('Login:password')} 
      /> 

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success">
          {successMessage}
        </div>
      )}

      <button className="fullWidth" onClick={onClick}>
        {btnText}
      </button>

      <a className="login__link" onClick={onClickChangeView}>{changeViewText}</a>
    </>
  );
  
  const renderLogin = () => renderForm({ 
    key: 'login', 
    onClick: submitLogin,
    onClickChangeView: changeView('register'),
    btnText: t('Login:Login'),
    changeViewText: t('Login:CreateAccount'),
  });

  const renderRegister = () => renderForm({ 
    key: 'register', 
    onClick: submitRegister,
    onClickChangeView: changeView('login'),
    btnText: t('Login:Register'),
    changeViewText: t('Login:Login'),
  });
    
  const renderUserCreated = () => (
    <div className="login__userCreated success" key="user-created">
      {successMessage}
    </div>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'login':
        return renderLogin();
      case 'register':
        return renderRegister();
      case 'userCreated':
        return renderUserCreated();
    }
  }

  return (
    <div className="login box background" key="login-container">
      <div className="flex">
        <h2>{t('Login:Login')}</h2>
      </div>
      <div className="boxDivider" />
      {!pendingRequestState.initialLoginFetch && renderActiveView()}
    </div>
  );
}

export default Login;
