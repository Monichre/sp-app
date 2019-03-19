import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonFacebookSignin } from './ButtonFacebookSignIn';
import { ButtonGoogleSignin } from './ButtonGoogleSignin';
import { ButtonCancelSignin } from './ButtonCancelSignin';

export const SignIn: React.SFC = () =>
  <div>
    <h1>Sign in</h1>
    <ButtonFacebookSignin>Sign in with Facebook</ButtonFacebookSignin>
    <br/>
    <ButtonGoogleSignin>Sign in with Google</ButtonGoogleSignin>
    <br/>
    <ButtonCancelSignin/>
    <hr/>
    <p>
      New to Soundpruf? <Link to='/auth/join'>Join</Link>
    </p>
  </div>
