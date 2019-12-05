import React from 'react';
import styled from 'styled-components'
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

export const ArtistLinkBlock = styled.a<{ src: string }>`
display: flex;
align-items: center;
text-align: center;
flex-direction: column;
// padding-top: ${bgSize / 2}rem;
// padding-left: ${bgSize / 12}rem;
padding-bottom: ${bgSize / 12}rem;
margin-bottom: 1rem;
text-decoration: none;
height: ${bgSize}rem;
width: 100%;
// width: ${bgSize}rem;
border-radius: 0.5rem;
background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({ src }) => src}");
background-position: center center;
background-size: cover;
`

export const ArtistName = styled.div`
  font-size: ${bgSize / 6}rem;
  // font-weight: 500;
  font-weight: bold;
  font-family: Righteous;
`

export const PaddedRight = styled.div`
width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export const ArtistPromoItem: React.SFC<FeaturedArtist> = ({ title, hover, src, href, name }) =>
  <div data-tip={hover}>
    <ArtistLinkBlock data-test='artist-row' target='new' {...{ href, src }}>
      <PaddedRight><SpotifyLogoLink href={href} size='3rem' /></PaddedRight>
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
    hover: '93 monthly streamers on Spotify',
    name: 'Warren Thomas Fenzi',
    href: 'https://open.spotify.com/artist/6oVxxtwC1wrrnDtEIuSIHW?si=TQvvafDtS4aOiFxyr57DBw',
    src: 'https://f4.bcbits.com/img/0016280307_10.jpg'
  },
  {
    title: 'Set',
    hover: '234,572 monthly streamers on Spotify',
    name: 'Bayonne',
    href: 'https://open.spotify.com/artist/6BbqU3r1G2mwkRIfIbkCek?si=0rllXlliQSySWht35Mj8wA',
    src: 'http://s3-eu-west-1.amazonaws.com/diy-magazine//diy/Artists/B/Bayonne/Bayonne001.jpeg'
  },
  {
    title: 'Liftoff',
    hover: '688,232 monthly streamers on Spotify',
    name: 'Arlo Parks',
    href: 'https://open.spotify.com/artist/4kIwETcbpuFgRukE8o7Opx?si=nuX8tNsTSCqybR0H_2tzLA',
    src: 'https://www.readdork.com/images/article/Artist-Images/A/Arlo%20Parks/Latitude%202019%20Portraits/_crop1500x1000/Arlo-Parks-Latitude-2019-www.patrickgunning.com-0841.jpg'
  },
]


export const FeaturedArtists: React.SFC = () =>
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist} />)}
  </ThreeColumns>
