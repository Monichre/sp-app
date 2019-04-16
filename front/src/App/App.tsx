import React from "react"
import { Loading } from "../shared/Loading"
import { AppMetaTags } from "./AppMetaTags"
import { GlobalStyle } from './GlobalStyle'
import { AppRoutes } from "./AppRoutes";
import { AppFirebaseProvider } from "./AppFirebaseProvider";
import { AppApolloProvider } from "./AppApolloProvider";

// react suspense isnt ready for async data loading in 16.8.x...
// but somehow react-apollo-hooks supports it

export const App: React.SFC = () => (
  <AppFirebaseProvider>
    <AppApolloProvider>
      <GlobalStyle/>
      <AppMetaTags />
      <React.Suspense fallback={<Loading />}>
        <AppRoutes/>
      </React.Suspense>
      </AppApolloProvider>
  </AppFirebaseProvider>
)
