import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useFirebaseAuth } from '../comp/FirebaseContext';
import * as queryString from 'query-string'

export const CustomAuth: React.SFC<RouteComponentProps> = ({history, location}) => {
  const customAccessToken = queryString.parse(location.search).customAccessToken as string
  const auth = useFirebaseAuth()
  useEffect(() => {
    auth.signInWithCustomToken(customAccessToken)
      .then(result => {
        console.log('logged in with custom token', result)
        history.replace('/')
      })
  })
  return <h1 style={{textAlign: 'center', marginTop: '3rem'}}>Logging in with Spotify...</h1>
}
