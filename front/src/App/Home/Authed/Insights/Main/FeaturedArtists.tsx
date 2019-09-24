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
    hover: '1,954 monthly streamers on Spotify',
    name: 'Author',
    href: 'https://open.spotify.com/artist/168uFZhYHTAe248zahXxfY?si=2QhPH-BISWaiDcH5x-aDTQ',
    src: 'https://s3.amazonaws.com/bit-photos/large/8991655.jpeg'
  },
  {
    title: 'Set',
    hover: '132,335 monthly streamers on Spotify',
    name: 'Sir Woman',
    href: 'https://open.spotify.com/artist/3H03S3ZtyYLdzsk6EYndUL?si=MmcqGpQ7T5iRvLzI9Jq6FQ',
    src: 'https://www.centraltrack.com/wp-content/uploads/2019/06/SIR-WOMAN.png'
  },
  {
    title: 'Liftoff',
    hover: '1,144,515 monthly streamers on Spotify',
    name: 'Stick Figure',
    href: 'https://open.spotify.com/artist/5SXEylV07TC57eanSxxg4R?si=HvkMG56SQIaAd6fRSbf-qQ',
    src: 'https://i1.wp.com/liveforlivemusic.com/wp-content/uploads/2015/06/stick_figure_final_update-3.jpg?fit=1200%2C799&ssl=1'
  },
]


export const FeaturedArtists: React.SFC = () =>
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist} />)}
  </ThreeColumns>
