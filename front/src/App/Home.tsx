import React from 'react';
import { useUser } from '../comp/FirebaseContext';
import { Dash } from './Dash';
import { SignIn } from './SignIn';

export const Home: React.SFC = () => {
  const { user, isLoading } = useUser()
  if (isLoading) return <div>Loading...</div>
  return user ? <Dash/> : <SignIn/>
}
