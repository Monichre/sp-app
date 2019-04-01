import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home } from './Home';
import { FirebaseContext } from '../comp/FirebaseContext';
import { createFirebase } from './createFirebase';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo-hooks'
import { CustomAuth } from './CustomAuth';
import styled from 'styled-components';

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_ENDPOINT}/graphql`,
})
const firebase = createFirebase({ // wrap this to validate and type it
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
})

const BlackPage = styled.div`
  height: 100%;
  * {
    color: white;
  }
  button {
    background-color: #333;
  }
`


export const App: React.SFC = () =>
  <FirebaseContext.Provider value={firebase}>
    <ApolloProvider client={client}>
      <BlackPage>
      <Router>
        <Route exact path='/' component={Home}/>
        <Route path='/customAuth' component={CustomAuth}/>
      </Router>
      </BlackPage>
    </ApolloProvider>
  </FirebaseContext.Provider>
