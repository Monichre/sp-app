import React from 'react'
import styled from 'styled-components'
import { Logo } from '../comp/Logo';

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
    font-family: "Fira Mono";
    text-transform: uppercase;
    font-size: 2rem;
    -webkit-font-smoothing: antialiased;
  }

`

const ButtonSpotifySignin: React.SFC = () =>
  <button data-test='spotifyLogin' onClick={() => window.location.assign(`${process.env.REACT_APP_API_ENDPOINT}/spotify/redirect`)}>
    Sign in with Spotify
  </button>

export const SignIn: React.SFC = () =>
    <BetweenColumn>
      <CenteredPage>
        <Hero>
          <Logo size={3}/>
          <h1>soundpruf</h1>
          <ButtonSpotifySignin/>
        </Hero>
      </CenteredPage>
      <LeftRowPadded>
        <a href='/'>
          Terms and Conditions
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <a href='/'>
          Privacy Policy
        </a>
      </LeftRowPadded>
    </BetweenColumn>
  
