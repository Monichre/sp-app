import React from "react"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo-hooks"

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_ENDPOINT}/graphql`,
})

export const AppApolloProvider: React.SFC = ({children}) => (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
)
