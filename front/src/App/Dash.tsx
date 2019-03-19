import React, { useState } from 'react';
import { LayoutAppBar } from './LayoutAppBar';
import { useUserChange, useUser } from '../comp/FirebaseContext';
import { DebugPrint } from '../comp/DebugPrint';
import { useUpdateSpotifyAuth, SpotifyCredentials } from '../types';

const Field: React.SFC<{name: string, state: string | undefined, setState: (s: string) => void}> = ({name, state, setState}) =>
  <div key={name}>
    <label htmlFor={name}>{name}</label>
    <input type='text' name={name} value={state} onChange={e => setState(e.target.value)}></input>
  </div>

const EnterSpotifyAuth: React.SFC = () => {
  const [ state, setState ] = useState<SpotifyCredentials>({spotifyId: '', accessToken: '', refreshToken: ''})
  const updateSpotifyAuth = useUpdateSpotifyAuth()

  const handleSubmit = async () => {
    const variables = {userId: 'foo', creds: state}
    console.log('submitting variables', variables)
    const result = await updateSpotifyAuth({variables})
    console.log('result', result)
  }

  return (
    <form onSubmit={e => { handleSubmit(); e.preventDefault()}}>
    <Field name='spotifyId' state={state.spotifyId} setState={spotifyId => setState({...state, spotifyId})}/>
    <Field name='accessToken' state={state.accessToken} setState={accessToken => setState({...state, accessToken})}/>
    <Field name='refreshToken' state={state.refreshToken} setState={refreshToken => setState({...state, refreshToken})}/>
    <button type='submit'>Update</button>
    </form>
  )
}

export const Dash: React.SFC = () => {
  useUserChange(user => !user && window.location.replace('/'))
  const { user, isLoading } = useUser()
  if (isLoading) { return <div>Loading</div> }
  return (
    <LayoutAppBar>
      <h1>My Dash</h1>
      <EnterSpotifyAuth/>
      <DebugPrint title='Firebase Auth User' value={user}/>
    </LayoutAppBar>
  )
}
