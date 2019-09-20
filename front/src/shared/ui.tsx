import React from 'react';
import styled, {css} from 'styled-components'
import { useUser, useAuthHandlers, BasicUser, impersonate } from '../App/FirebaseContext';
import { Redirect } from 'react-router';
const Color = require('color')

const Blue = Color('#00bcdd')
const Pink = Color('#ff00ff')
const Slate = Color('rgb(16,24,50)')

export const Button: any = styled.button`
@mixin transition-all {
  -webkit-transition: all 200ms ease-in-out;
  -moz-transition: all 200ms ease-in-out;
  -o-transition: all 200ms ease-in-out;
	transition: all 200ms ease-in-out;
}

  color: ${Slate.hex()};
  cursor: pointer;
  display: inline-block;
  letter-spacing: 0.075em;
  padding: .8em 1em;
  margin: auto 2em;
  position: relative;
  align-self: center;
  text-transform: uppercase;
  border: 3px ${Blue.hex()} solid;
  border-image: linear-gradient(45deg, ${Blue.hex()} 0%, ${Pink.hex()} 100%);
  border-image-slice: 1 1 0 0;
  z-index: 1;
  box-shadow: -0.5em .5em rgb(16,24,50,.5);
  transform-origin: left bottom;
  @include transition-all;
  
  &:before,
  &:after {
    border: 3px ${Blue.hex()} solid;
    content: '';
    display: block;
    position: absolute;
    z-index: -1;
  }
  
  // SIDE
  &:before {
    border-image: linear-gradient(45deg, ${Blue.hex()} 0%, ${Blue.lighten(0.5)} 100%);
    border-image-slice: 1 1 0 1;
    left: -0.59em; top: .15em;
    width: .31em;
    height: 100%;
    transform: skewY(-45deg);
  }
  
  // BOTTOM
  &:after {
    border-image: linear-gradient(45deg, ${Blue.hex()} 0%, ${Pink.hex()} 100%);
    border-image-slice: 1 1 1 0;
    bottom: -0.61em; right: 0.16em;
    width: 100%;
    height: .31em;
    transform: skewX(-45deg);
  }
  
  // Shadow
  &:hover {
    //border-image-slice: 1;
    background-color: white;
    background-size: 90%;
    transform: translate(0.5em,-0.5em);
    box-shadow: -1em 1em .15em ${Slate.alpha(.5).hex()};
    // box-shadow: -1em 1em 1em ${Blue.alpha(.5).hex()}, -1em 1.9em 1.9em ${Slate.alpha(.5).hex()}, 0em .38em .38em ${Slate.alpha(.5).hex()}, 0em .76em .76em ${Slate.alpha(.5).hex()}, 0em 1.52em 1.52em ${Slate.alpha(.5).hex()};
    
    
    &:before {
      @include background-image(linear-gradient(45deg, ${Blue.hex()} 0%, ${Blue.lighten(.5).hex()} 100%));
      height: calc(100% - .13em);
      border-image-slice: 1;
    }
    
    &:after {
      @include background-image(linear-gradient(45deg, ${Blue.hex()} 0%, ${Pink.hex()} 100%));
      width: calc(100% - .13em);
      border-image-slice: 1;
    }
  }
`


export const GradientButtonOutline = styled.button`

`

export const GradientButtonFilled = styled(Button)`
  background-color: ${Blue.hex()}; // Old browsers
  background-image: linear-gradient(45deg, ${Blue.hex()} 0%, ${Pink.hex()} 100%);
  border-image: linear-gradient(45deg, ${Blue.lighten(.2).hex()} 0%, ${Pink.lighten(.2).hex()} 100%);
  border-image-slice: 1;
  color: white;


  @media screen and (max-width: 1000px) {
    margin-top: 20px;
    
}
  
  &:before {
    border-image-slice: 1;
    background-image: linear-gradient(45deg, ${Blue.hex()} 0%, ${Blue.lighten(.2).hex()} 100%);
    left: -0.75em;
    top: .15em;
  }
  
  &:after {
    border-image-slice: 1;
    background-image: linear-gradient(45deg, ${Blue.hex()} 0%, ${Pink.hex()} 100%);
    bottom: -0.75em;
    right: .15em;
  }
  
  &:hover {
    background: white;
    background-image: linear-gradient(45deg, ${Blue.hex()} 0%, ${Blue.lighten(.2).hex()} 100%);
    border-image: linear-gradient(45deg, ${Blue.hex()} 0%, ${Pink.hex()} 100%);
    border-image-slice: 1;
    color: ${Slate.hex()};
    
    &:before {
      height: 100%;
    }
    &:after {
      width: 100%;
    }
  }

`

export const ButtonSignout: React.SFC = () => {
  const { signOut } = useAuthHandlers()
  return <GradientButtonFilled onClick={() => {

    signOut()
    return <Redirect to='/' />
  }}>Sign Out</GradientButtonFilled>
}

export const Container: any = styled.div`
  margin: 0rem 1rem;

  ${(props: any) => props.padded && css`
  /* padding-top: 20px; */
  `}

  @media screen and (max-width: 768px) {
    margin: 0;
  }
`
