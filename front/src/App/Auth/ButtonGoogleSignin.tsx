import React from 'react'
import { useAuthHandlers } from '../../comp/FirebaseContext';

export const ButtonGoogleSignin: React.SFC = ({children}) => {
  const { signInWithGoogle } = useAuthHandlers()
  return <button onClick={() => signInWithGoogle()}>{children}</button>
}
