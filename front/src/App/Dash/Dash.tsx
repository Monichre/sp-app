import React from 'react';
import { LayoutAppBar } from '../LayoutAppBar';
import { useUserChange, useUser } from '../../comp/FirebaseContext';
import { RecentPlays } from './RecentPlays';
import { PlaytimeSummary } from './PlaytimeSummary';

// we are passing uid={user.uid} to the child components
// when we would rather be just doing useUser() with a hook inside them (i think?)
// but i dont want to deal with that until our useUser hook is suspenseful
// otherwise we have to put this isLoading bullshit all over the place to get type safety
// when we dont really need it
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
      <PlaytimeSummary uid={user.uid}/>
      <RecentPlays uid={user.uid}/>
    </LayoutAppBar>
  )
}

