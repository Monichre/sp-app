import React from 'react'
import styled from 'styled-components'

const logo = require('./sp-white-logo.png')

const LogoImg = styled.img<{size: number}>`
  height: ${props => props.size}rem;
  width: ${props => props.size}rem;
`

export const Logo: React.SFC<{size: number}> = ({size}) => <LogoImg src={logo} size={size}/>

