import React from 'react';
import styled from 'styled-components'

const logoSvg = require('./SpotifyLogo.svg')

const SmallIconLink = styled.div<{size: string}>`
  cursor: pointer;
  margin-top: 0.5rem;
  height: ${({size}) => size};
  width: ${({size}) => size};
  display: block;
  z-index: 5;
`

// because this is often contained within a card that is itself a link
// gotta use onclick and preventdefault
export const SpotifyLogoLink: React.SFC<{href: string, size?: string}> = ({href, size='1.5rem'}) =>
  <SmallIconLink {...{size}} onClick={e => { e.preventDefault(); window.open(href, '_blank')}}>
    
    <svg version="1.1" fill='#FFF' id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      // @ts-ignore
	 viewBox="0 0 186.845 186.845" style={{enableBackground:'new 0 0 186.845 186.845'}} xmlSpace="preserve">
<g>
	<path d="M128.875,120.962c-31.094-14.37-74.616-8.014-76.453-7.737c-4.096,0.619-6.915,4.44-6.296,8.536
		c0.619,4.096,4.443,6.912,8.536,6.296c0.406-0.062,40.867-5.982,67.92,6.521c1.018,0.471,2.089,0.694,3.142,0.694
		c2.834-0.001,5.546-1.614,6.813-4.355C134.274,127.157,132.635,122.7,128.875,120.962z"/>
	<path d="M137.614,93.953c-35.313-16.319-84.833-9.087-86.924-8.772c-4.094,0.619-6.911,4.438-6.294,8.532
		c0.616,4.095,4.438,6.916,8.531,6.301c0.468-0.071,47.206-6.857,78.394,7.556c1.02,0.471,2.089,0.694,3.142,0.694
		c2.834-0.001,5.546-1.614,6.814-4.356C143.014,100.148,141.374,95.691,137.614,93.953z"/>
	<path d="M143.49,65.736c-39.006-18.027-93.79-10.028-96.103-9.679c-4.094,0.619-6.911,4.438-6.294,8.532s4.44,6.919,8.531,6.3
		c0.523-0.079,52.691-7.657,87.573,8.463c1.018,0.471,2.089,0.694,3.142,0.694c2.834,0,5.546-1.614,6.813-4.355
		C148.89,71.93,147.25,67.474,143.49,65.736z"/>
	<path d="M93.423,0.001C41.909,0.001,0,41.909,0,93.42c0,51.514,41.909,93.424,93.423,93.424c51.513,0,93.422-41.91,93.422-93.424
		C186.845,41.909,144.936,0.001,93.423,0.001z M93.423,171.844C50.18,171.844,15,136.664,15,93.42
		c0-43.241,35.18-78.42,78.423-78.42c43.242,0,78.422,35.179,78.422,78.42C171.845,136.664,136.665,171.844,93.423,171.844z"/>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>

  </SmallIconLink>
