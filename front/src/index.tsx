import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import { App } from './App/App';
import * as serviceWorker from './serviceWorker';
import LogRocket from 'logrocket'
import 'sanitize.css'

if (process.env.REACT_APP_LOGROCKET_APP_ID) {
    LogRocket.init(process.env.REACT_APP_LOGROCKET_APP_ID)
} else {
  throw new Error('cannot initialize logrocket, is REACT_APP_LOGROCKET_APP_ID missing from frontend build?')
}
Sentry.init({
    dsn: "https://0dfd7c850a6341699ea2bfb55697ada3@sentry.io/1757770",
    environment: 'release/test',
    release: `db0939a792e161de32b2660807ed88e335cd0075`
});

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();

