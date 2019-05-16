import React from 'react'
import styled from 'styled-components'
import { Logo } from '../../../shared/Logo';
import moment from 'moment';
import { Link } from 'react-router-dom';

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

const Button = styled.button`
  background-color: #333;
  border: 1px solid #64d6ee;
  border-radius: 0.5rem;
  color: #64d6ee;
  font-weight: bold;
  font-size: 1.25rem;
  padding: 1rem;
  margin-top: 1.5rem;
`

const ButtonSpotifySignin: React.SFC = () => {
  const d = moment()
  const utcOffset = d.utcOffset()
  console.log(utcOffset)
  return (
    <Button data-test='spotifyLogin' onClick={() => window.location.assign(`${process.env.REACT_APP_API_ENDPOINT}/spotify/redirect?utcOffset=${utcOffset}`)}>
      Sign in with Spotify
    </Button>
  )
}

export const SignIn: React.SFC = () =>
    <BetweenColumn>
      <CenteredPage>
        <Hero>
          <Logo size={12}/>
          <ButtonSpotifySignin/>
        </Hero>
      </CenteredPage>
      <LeftRowPadded>
        <Link to='/terms-and-conditions'>
          Terms and Conditions
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to='/privacy-policy'>
          Privacy Policy
        </Link>
      </LeftRowPadded>
    </BetweenColumn>
  
