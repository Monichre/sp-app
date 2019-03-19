import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home } from './Home';
import { Auth } from './Auth/Auth';
import { Dash } from './Dash';
import { FirebaseContext } from '../comp/FirebaseContext';
import { createFirebase } from './createFirebase';
import { DumpEnv } from '../comp/DumpEnv';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo-hooks'

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_ENDPOINT}/graphql`,
})
const firebase = createFirebase({ // wrap this to validate and type it
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
})

export const App: React.SFC = () =>
  <FirebaseContext.Provider value={firebase}>
    <ApolloProvider client={client}>
      <Router>
        <Route exact path='/' component={Home}/>
        <Route path='/auth' component={Auth}/>
        <Route path='/dash' component={Dash}/>
        <DumpEnv/>
      </Router>
    </ApolloProvider>
  </FirebaseContext.Provider>
