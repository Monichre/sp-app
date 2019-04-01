import React from 'react';
import { LayoutAppBar } from '../LayoutAppBar';
import { useUserChange, useUser } from '../../comp/FirebaseContext';
import { RecentPlays } from './RecentPlays';

export const Dash: React.SFC = () => {
  useUserChange(user => !user && window.location.replace('/'))
  const { user, isLoading } = useUser()
  if (isLoading) { return <div>Loading</div> }
  if (!user) { return <div>User not found!</div>}
  return (
    <LayoutAppBar>
      <h1 style={{textAlign: 'center'}}>
        Welcome to Soundpruf,
        <br/>
        <span data-test="displayName">{user.displayName}</span>
      </h1>
      <RecentPlays uid={user.uid}/>
    </LayoutAppBar>
  )
}

