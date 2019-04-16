import React from 'react'
import styled, { keyframes } from 'styled-components'

const animateGlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const OffsetBody = styled.div`
  margin: 4.0rem 1rem 0 1rem;

  &:after {
    position: fixed;
    content: "";
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    height: 3rem;
    width: 100%;
    margin: 0 auto;
    transform: scale(.75);
    background: linear-gradient(270deg, #0fffc1, #7e0fff);
    background-size: 200% 200%;
    animation: ${animateGlow} 10s ease infinite;
    filter: blur(5vw);
    -webkit-filter: blur(5vw);
    -moz-filter: blur(5vw);
    -ms-filter: blur(5vw);

    @media (max-width: 800px) {
      filter: blur(15vw);
      -webkit-filter: blur(15vw);
      -moz-filter: blur(15vw);
      -ms-filter: blur(15vw);
    }
  }
`

export const AuthedLayout: React.SFC = ({children}) =>
  <OffsetBody>
    {children}
  </OffsetBody>
