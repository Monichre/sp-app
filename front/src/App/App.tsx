import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Home } from "./Home"
import { FirebaseContext } from "../comp/FirebaseContext"
import { createFirebase } from "./createFirebase"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo-hooks"
import { CustomAuth } from "./CustomAuth"
import { createGlobalStyle } from "styled-components"
import { Loading } from "../comp/Loading"
import { AppMetaTags } from "./AppMetaTags"

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_ENDPOINT}/graphql`,
})

const firebase = createFirebase({
  // wrap this config to validate and type it
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
})

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    font-family: "Raleway", sans-serif;
    color: #fff;
    background-color: #121519;
    background-image: url(/dots.png);
    background-repeat: repeat;
    background-size: 20px 20px;
    background-blend-mode: color-dodge;
    max-height: 100vh;
    height: 100%;
    overflow-x: hidden;
    position: relative;
    z-index: 10;
  }
  a {
    color: white;
  }
`

// react suspense isnt ready for async data loading in 16.8.x...
// but somehow react-apollo-hooks supports it

export const App: React.SFC = () => (
  <FirebaseContext.Provider value={firebase}>
    <ApolloProvider client={client}>
      <GlobalStyle/>
      <AppMetaTags />

      <React.Suspense fallback={<Loading />}>
        <Router>
          <Switch>
            <Route path="/customAuth" component={CustomAuth} />
            <Route path="/" component={Home} />
          </Switch>
        </Router>
      </React.Suspense>
    </ApolloProvider>
  </FirebaseContext.Provider>
)
