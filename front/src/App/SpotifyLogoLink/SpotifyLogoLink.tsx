import React from 'react';
import styled from 'styled-components'

const logoSvg = require('./SpotifyLogo.svg')

const SmallIconLink = styled.a`
  margin-top: 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
  display: block;
  opacity: 0.5;
`

export const SpotifyLogoLink: React.SFC<{href: string}> = ({href}) =>
  <SmallIconLink {...{href}} target='new'>
    <img src={logoSvg} color='white'/>
  </SmallIconLink>
