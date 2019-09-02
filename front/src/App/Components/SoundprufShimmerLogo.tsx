import * as React from 'react';
import styled from 'styled-components';

// Change the colors


const TextEffect = styled.div`
  overflow: hidden;
  position: relative;
  
  /* // The blend modes mute the colors, so let's bump them up */
  filter: contrast(110%) brightness(190%);
`


// Add the colors
const Gradient = styled.div`

    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    pointer-events: none;
    z-index: 10;  
    background: linear-gradient(45deg, red, blue);

    /* // Multiply mode will paint only the white text */
    mix-blend-mode: multiply;
`

const SpotLight = styled.div`
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  pointer-events: none;
  z-index: 10;  
  animation: light 5s infinite linear;
  
  /* // These are the lights, color-dodge needs a black bg for optimum effect */
  background: 
    radial-gradient(circle, white, transparent 25%) 0 0 / 25% 25%, 
    radial-gradient(circle, white, #030616 25%) 50% 50% / 12.5% 12.5%;
  top: -100%; left: -100%;
  
  /* // Color dodge gives the lights that shimmer effect */
  mix-blend-mode: color-dodge;


@keyframes light {
  100% {
    transform: translate3d(50%, 50%, 0);
  }
}
`



const Neon: any = styled.h1`
    /* font: 700 220px 'Lato', sans-serif; */
    position: relative;

    /* // Only works on a black background, sorry */

    -webkit-font-smoothing: antialiased;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 4rem;
    background: #030616;
    font-family: "Source Sans Pro",sans-serif!important;
    /* // The actual text inside the div is superfluous, only data-text matters. The text is added so you can easily edit the preview */
    color: transparent;
  
  &::before,
  &::after {
    /* // Add two copies of the text on their own layer */
    content: attr(data-text);
    
    /* // White, so we can paint them later */
    color: white;
    
    /* // And blur them to create the neon effect with the blend-mode below */
    filter: blur(0.02em);
    width: 100%;
    position: absolute;
    top: 0; left: 0;
    pointer-events: none;
  }
  
  /* // Set the top copy to difference. This creates the knock-out effect with a bit of glow */
  &::after {
    mix-blend-mode: difference;
  }
  text-transform: uppercase;
  text-align: center;
  margin: 0;
  
  &:focus { outline: none; border: 1px dotted white; }
`



export interface SoundprufShimmerLogoProps {

}

export const SoundprufShimmerLogo: React.SFC<SoundprufShimmerLogoProps> = () => {
    return (
        <TextEffect>
            <Neon data-text='Soundpruf'>Soundpruf</Neon>
            <Gradient />
            <SpotLight />
        </TextEffect>
    );
}

