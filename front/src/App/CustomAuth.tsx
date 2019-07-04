import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useFirebaseAuth } from './FirebaseContext';
import * as queryString from 'query-string'
import LogRocket from 'logrocket'

export const CustomAuth: React.SFC<RouteComponentProps> = ({history, location}) => {
  const customAccessToken = queryString.parse(location.search).customAccessToken as string
  const auth = useFirebaseAuth()
  useEffect(() => {
    auth.signInWithCustomToken(customAccessToken)
      .then(result => {
        console.log('logged in with custom token', result)
        if (result.user) {
          //@ts-ignore
          window.intercomSettings = {
            app_id: process.env.REACT_APP_INTERCOM_APP_ID,
            // name: user.displayName || 'N/A', // Full name
            // email: user.email || 'N/A', // Email address
            // user_id: user.uid,
            // avatar: {
            //   "type": "avatar",
            //   "image_url": user.photoURL
            // }, // current_user_id
            // initialHarvestComplete,
            // lastUpdate

          }

          
          //@ts-ignore
          FS.identify(result.user.uid, {
            displayName: result.user.displayName || 'N/A',
            email: result.user.email || 'N/A',
          })
         
          return LogRocket.identify(result.user.uid, {
            name: result.user.displayName || 'N/A',
            email: result.user.email || 'N/A',
          })
        }
      })
      .then(() => {
        history.replace('/')
      })
  })
  return <h1 style={{textAlign: 'center', marginTop: '3rem'}}>Logging in with Spotify...</h1>
}
