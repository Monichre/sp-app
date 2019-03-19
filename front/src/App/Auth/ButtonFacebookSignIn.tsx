import React from 'react'
import { useAuthHandlers } from '../../comp/FirebaseContext';

export const ButtonFacebookSignin: React.SFC = ({children}) => {
  const { signInWithFacebook } = useAuthHandlers()
  return <button onClick={() => signInWithFacebook()}>{children}</button>
}
