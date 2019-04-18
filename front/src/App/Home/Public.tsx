import React from 'react'
import styled from 'styled-components'
import { Logo } from '../../shared/Logo';
import moment from 'moment';
import { Route, Switch, Redirect } from 'react-router';
import { SignIn } from './SignIn'
import { TAndC } from './TAndC';
import { Privacy } from './Privacy';

const BetweenColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`

const LeftRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`

const LeftRowPadded = styled(LeftRow)`
  padding: 1rem;
`

const CenteredPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const Hero = styled.div`
  background-color: #252833;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  img {
    margin-left: auto;
    margin-right: auto;
  }

  h1 {
    font-weight: 700
    text-transform: uppercase;
    font-size: 2rem;
    -webkit-font-smoothing: antialiased;
  }
`

const ButtonSpotifySignin: React.SFC = () => {
  const d = moment()
  const utcOffset = d.utcOffset()
  console.log(utcOffset)
  return (
    <button data-test='spotifyLogin' onClick={() => window.location.assign(`${process.env.REACT_APP_API_ENDPOINT}/spotify/redirect?utcOffset=${utcOffset}`)}>
      Sign in with Spotify
    </button>
  )
}

export const Public: React.SFC = () =>
  <Switch>
    <Route path='/terms-and-conditions' component={TAndC}/>
    <Route path='/privacy-policy' component={Privacy}/>
    <Route path='/' component={SignIn}/>
  </Switch>
