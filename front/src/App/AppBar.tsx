import React from 'react'
import { useUser, useAuthHandlers } from '../comp/FirebaseContext';
import { Link } from 'react-router-dom';
import { ButtonFacebookSignin } from './Auth/ButtonFacebookSignIn';
import { ButtonGoogleSignin } from './Auth/ButtonGoogleSignin';

type WithUserProps = {
  user: firebase.User
}

const ButtonSignout: React.SFC = () => {
  const { signOut } = useAuthHandlers()
  return <button onClick={() => signOut()}>Sign Out</button>
}

const UserInfo: React.SFC<WithUserProps> = ({user}) =>
  <div>
    Your email: {user.email} : <ButtonSignout/>
  </div>

const AnonInfo: React.SFC = () =>
  <div>
    <Link to='/auth/signin'><button>Sign In</button></Link> |
    <ButtonFacebookSignin>FB</ButtonFacebookSignin> |
    <ButtonGoogleSignin>Goog</ButtonGoogleSignin>
  </div>

export const AppBar: React.SFC = () => {
  const { user } = useUser()
  return (
    <div>
      <div><Link to='/'>Soundpruf</Link> { user && <span>| <Link to='/dash'>Dash</Link></span>}</div>
      { user ? <UserInfo {...{user}}/> : <AnonInfo/> }
      <hr/>
    </div>
  )
}

