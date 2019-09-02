import React from 'react'
import styled from 'styled-components'
import { Logo } from '../../../shared/Logo';

import moment from 'moment';
import { Link } from 'react-router-dom';
import { SoundprufShimmerLogo } from '../../Components/SoundprufShimmerLogo';
import { GradientButtonFilled } from '../../../shared/ui';


const BetweenColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
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
  background-color: #030616;
  
  padding: 1rem;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  img {
    margin-left: auto;
    margin-right: auto;
  }

`



const ButtonSpotifySignin: React.SFC = () => {
  const d = moment()
  const utcOffset = d.utcOffset()
  
  return (
    <GradientButtonFilled data-test='spotifyLogin' onClick={() => window.location.assign(`${process.env.REACT_APP_API_ENDPOINT}/spotify/redirect?utcOffset=${utcOffset}`)}>
      Sign in with Spotify
    </GradientButtonFilled>
  )
}

export const SignIn: React.SFC = () =>
    <BetweenColumn>
      <CenteredPage>
        <Hero>
        <Logo size={12} />
        
        <br />
        <br />
        {/* <SoundprufShimmerLogo /> */}
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
  
