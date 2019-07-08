import React from 'react';
import styled from 'styled-components'
import { BlockTitle } from '../shared/BlockTitle';
import { SpotifyLogoLink } from '../../../../../shared/SpotifyLogoLink/SpotifyLogoLink';

const bgSize = 24;

const ThreeColumns = styled.div`
  margin: 0rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 2rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  align-items: center;
`

const ArtistLinkBlock = styled.a<{src: string}>`
display: flex;
align-items: center;
text-align: center;
flex-direction: column;
// padding-top: ${bgSize/2}rem;
// padding-left: ${bgSize/12}rem;
padding-bottom: ${bgSize/12}rem;
margin-bottom: 1rem;
text-decoration: none;
height: ${bgSize}rem;
width: 100%;
// width: ${bgSize}rem;
border-radius: 0.5rem;
background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({src}) => src}");
background-position: center center;
background-size: cover;
`

const ArtistName = styled.div`
  font-size: ${bgSize/6}rem;
  // font-weight: 500;
  font-weight: bold;
  font-family: Righteous;
`

const PaddedRight = styled.div`
width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const ArtistPromoItem: React.SFC<FeaturedArtist> =  ({title, hover, src, href, name}) =>
<div data-tip={hover}>
{/* <BlockTitle>{title}</BlockTitle> */}
<ArtistLinkBlock data-test='artist-row' target='new' {...{href, src}}>
  <PaddedRight><SpotifyLogoLink href={href} size='3rem'/></PaddedRight>
  <ArtistName data-test='artist-row-name'>{name}</ArtistName>
</ArtistLinkBlock>
</div>

type FeaturedArtist = {
  title: string
  hover: string
  name: string
  href: string
  src: string
}


const featuredArtists: FeaturedArtist[] = [
  {
    title: 'Ready',
    hover: 'Artists under 5,000 monthly streamers on Spotify',
    name: 'Night Glitter',
    href: 'https://open.spotify.com/artist/2ujENWdLHYFbb32PWCRDip?si=w1n0LWZmT36hhz4OzWlwmg',
    src: 'https://www.austinchronicle.com/binary/8fd7/music_play-1.jpg',
  },
  {
    title: 'Set',
    hover: 'Artists under 200,000 monthly streamers on Spotify',
    name: 'Charly Bliss',
    href: 'https://open.spotify.com/artist/7axA2bNeZsae6t2mgxoSFh?si=VEwTjMN_TkC9Ej-_q6M3pQ',
    src: 'https://www.rollingstone.com/wp-content/uploads/2019/02/Shervin-Lainez.jpg',
  },
  {
    title: 'Liftoff',
    hover: 'Artists under 2,500,000 monthly streamers on Spotify',
    name: 'Kevin Abstract',
    href: 'https://open.spotify.com/artist/07EcmJpfAday8xGkslfanE?si=-oMeDoF4Q0i3l8bLBOgLrQ',
    src: 'https://consequenceofsound.net/wp-content/uploads/2019/04/kevin-abstract-arizona-baby-album-release-stream.png?w=807',
  },
]

export const FeaturedArtists: React.SFC = () => 
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist}/>)}
  </ThreeColumns>
