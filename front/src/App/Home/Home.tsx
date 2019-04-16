import React from 'react';
import { useUser } from '../FirebaseContext';
import { Loading } from '../../shared/Loading';
import { ErrorBoundary } from './ErrorBoundary'
import { SignIn } from './SignIn';
import { Authed } from './Authed/Authed';

export const Home: React.SFC = () => {
  const { user, isLoading } = useUser()
  if (isLoading) return <Loading/>
  return <ErrorBoundary>{user ? <Authed {...{user}}/> : <SignIn/>}</ErrorBoundary>
}