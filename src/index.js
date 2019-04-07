import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const createScriptTag = src => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;

  document.appendChild(script);
};

// createScriptTag('http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js');
// createScriptTag('http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/mode-cfb-min.js');

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
