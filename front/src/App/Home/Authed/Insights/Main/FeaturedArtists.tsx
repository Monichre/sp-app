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
    hover: '187 monthly streamers on Spotify',
    name: 'Little Man',
    href: 'https://open.spotify.com/artist/665B5lcXiaWnsLIwtJ7epw?si=n7dB0QbsT1OfgvxI1l5NUg',
    src: '/littleman.jpg'
  },
  {
    title: 'Set',
    hover: '106,643 monthly streamers on Spotify',
    name: 'GUM',
    href: 'https://open.spotify.com/artist/4Oov8BULUOBiX6UVpP04JW?si=MkjlWodBR0-RisWJl0CmyA',
    src: 'http://www.undertheradarmag.com/uploads/article_images/Gum_Interview_under_the_radar.jpg'
  },
  {
    title: 'Liftoff',
    hover: '877,023 monthly streamers on Spotify',
    name: 'Shay Lia',
    href: 'https://open.spotify.com/artist/3sJQwG0SsGRyv5C5kh4o9a?si=NUT5uvZiQpablPOQWJvgTQ',
    src: 'https://lastfm-img2.akamaized.net/i/u/770x0/2a4be8e4c1af612a3942e2dd89ecd4c9.jpg'
  },
]


export const FeaturedArtists: React.SFC = () =>
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist} />)}
  </ThreeColumns>
