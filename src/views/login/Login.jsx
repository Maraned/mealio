import React, { useState, useRef, useEffect, useContext } from 'react';
import posed, { PoseGroup } from 'react-pose';
import { LoggedInContext } from 'contexts/login';
import { GunContext } from 'contexts/gun';
import { UserContext } from 'contexts/user';
import { PendingRequestContext } from 'contexts/pendingRequests';

import { useTranslation } from 'react-i18next';

import { postRequest } from 'utils/request';

import './login.css';

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
  },
  enter: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  }
});

const Login = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const popupNode = useRef(null);
  const [email, setEmail] = useState('a@b.com');
  const [password, setPassword] = useState('a@b.com');
  const { dispatch } = useContext(LoggedInContext);
  const Gun = useContext(GunContext);
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
    localStorage.setItem('email', user.email);
    userDispatch({ type: 'user', value: user });

    dispatch({ type: 'login' });
  }

  const authenticateUser = async () => {
    // var encrypted = CryptoJS.AES.encrypt(
    //   `${email}:${password}`, 
    //   process.env.passPhrase, 
    //   { mode: CryptoJS.mode.CFB }
    // );
    // var encrypted = CryptoJS.AES.encrypt(btoa(`${email}:${password}`), passPhrase, { mode: CryptoJS.mode.CFB });
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
    <Box
      key={key}
      ref={popupNode}
      pose={popupOpen ? 'visible' : 'hidden'}
      className="login__popup"
    >
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

      <button onClick={onClick}>
        {btnText}
      </button>

      <a className="login__link" onClick={onClickChangeView}>{changeViewText}</a>
    </Box>
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

  return !pendingRequestState.initialFetch && (
    <div className="login" key="login-container">
      <button 
        onClick={() => setPopupOpen(!popupOpen)}
      >
        {t('Login:login')}
      </button>

    <PoseGroup>
      {activeView === 'login' && renderLogin()}
      {activeView === 'register' && renderRegister()}
      {activeView === 'userCreated' && renderUserCreated()}
    </PoseGroup>

    </div>
  )
}

export default Login;
