import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthHandlers } from '../../comp/FirebaseContext';
import { ButtonFacebookSignin } from './ButtonFacebookSignIn';
import { ButtonGoogleSignin } from './ButtonGoogleSignin';
import { ButtonCancelSignin } from './ButtonCancelSignin';

type JoinViewProps = {
  signInWithFacebook: any
}

const JoinView: React.SFC<JoinViewProps> = ({signInWithFacebook}) =>
  <div>
  <h1>Join now</h1>
  <ButtonFacebookSignin>Join with Facebook</ButtonFacebookSignin>
  <br/>
  <ButtonGoogleSignin>Join with Google</ButtonGoogleSignin>
  <br/>
  <ButtonCancelSignin/>
  <hr/>
  <p>Already have an account? <Link to='/auth/signin'>Sign In</Link></p>
  </div>

export const Join: React.SFC = () => {
  const { signInWithFacebook } = useAuthHandlers()
  return <JoinView {...{signInWithFacebook}}/>
}