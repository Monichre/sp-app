import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../comp/FirebaseContext';
import { LayoutAppBar } from './LayoutAppBar';
import { usePing } from '../types';
import { DebugPrint } from '../comp/DebugPrint';

const Hero: React.SFC = () =>
  <div>
    <Link to='/auth/join'>
      <button><h1>JOIN NOW!!!</h1></button>
    </Link>
  </div>

const PingResult: React.SFC = () => {
  const {data, error, loading } = usePing()
  return (
    <DebugPrint value={{data, error, loading}} title='GraphQL Ping Result'/>
  )
}

type HomeViewProps = {
  user: firebase.User | null,
}

export const Home: React.SFC<HomeViewProps> = () => {
  const { user, isLoading } = useUser()
  if (isLoading) return <div>Loading...</div>
  return (
    <LayoutAppBar>
      <h1>Home</h1>
      { user ? <div>hello {user.displayName}!</div> : <Hero/> }
      <hr/>
      <PingResult/>
    </LayoutAppBar>
  )
}
