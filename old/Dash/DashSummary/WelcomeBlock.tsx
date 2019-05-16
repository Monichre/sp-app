import React from 'react';
import styled from 'styled-components'

const Block = styled.div`
  padding: 1rem;
  margin: 0rem;
  & > * {
    margin-bottom: 1rem;
  }
`

export const HeroBlock = styled(Block)`
  font-size: 34px;
  line-height: 40px;
  font-weight: 600;
`

const fName = (s: string) => s.split(' ')[0]

const WelcomeFor: React.SFC<{displayName: string | null}> = ({displayName}) =>
  (displayName && fName(displayName)) ?
    <span>Welcome, {fName(displayName)}.</span> :
    <span>Welcome.</span>

export const WelcomeBlock: React.SFC<{displayName: string | null, className?: string}> = ({displayName, className}) => 
  <HeroBlock {...{className}}>
    <WelcomeFor {...{displayName}}/>
    <br/>Here are your latest listening stats.
  </HeroBlock>
