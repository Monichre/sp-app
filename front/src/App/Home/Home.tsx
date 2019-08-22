import React from 'react';
import { useUser } from '../FirebaseContext';
import { Loading } from '../../shared/Loading';
import { ErrorBoundary } from './ErrorBoundary'
import { Public } from './Public/Public';
import { Authed } from './Authed/Authed';

export const Home: React.SFC = (props) => {
  const { user, isLoading } = useUser()
  if (isLoading) return <Loading/>
  return <ErrorBoundary>{user ? <Authed {...{ user }} {...props}/> : <Public/>}</ErrorBoundary>
}
