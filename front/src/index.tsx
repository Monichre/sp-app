import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App/App';
import * as serviceWorker from './serviceWorker';
import LogRocket from 'logrocket'
import 'sanitize.css'

if (process.env.REACT_APP_LOGROCKET_APP_ID) {
    LogRocket.init(process.env.REACT_APP_LOGROCKET_APP_ID)
} else {
    throw new Error('cannot initialize logrocket, is REACT_APP_LOGROCKET_APP_ID missing from frontend build?')
}


ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();

