import React from 'react';
import styled from 'styled-components'

const logoSvg = require('./SpotifyLogo.svg')

const SmallIconLink = styled.div`
  cursor: pointer;
  margin-top: 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
  display: block;
  opacity: 0.5;
  z-index: 5;
`

// because this is often contained within a card that is itself a link
// gotta use onclick and preventdefault
export const SpotifyLogoLink: React.SFC<{href: string}> = ({href}) =>
  <SmallIconLink onClick={e => { e.preventDefault(); window.open(href, '_blank')}}>
    <img src={logoSvg} color='white'/>
  </SmallIconLink>
