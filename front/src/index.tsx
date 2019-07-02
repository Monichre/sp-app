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

// ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

