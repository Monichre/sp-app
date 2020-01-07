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
    hover: '1,814 monthly streamers on Spotify',
    name: 'Jenny Mitchell',
    href: 'https://open.spotify.com/artist/4nuqPXV9cR0OGDbYw0Zwj9?si=5ZcS6rWXTu6MEhM5Yk6tVA',
    src: 'https://f4.bcbits.com/img/0007710463_10.jpg'
  },
  {
    title: 'Set',
    hover: '50,937 monthly streamers on Spotify',
    name: 'Tacocat',
    href: 'https://open.spotify.com/artist/3h0MN1neFknEvlYKxFmSQW?si=qSRbZX4lTbSWXs475KpMyg',
    src: 'https://hardlyart-production-image.s3.amazonaws.com/asset/artist_images/attachments/000/000/100/cropped_620_415/tacocat1.jpg?1459902904'
  },
  {
    title: 'Liftoff',
    hover: '1,567,820 monthly streamers on Spotify',
    name: 'Tyler Childers',
    href: 'https://open.spotify.com/artist/13ZEDW6vyBF12HYcZRr4EV?si=CE7o3_npQOmSWtzyjJNqEA',
    src: 'https://www.kentucky.com/latest-news/npmo1g/picture232725427/alternates/FREE_1140/a0017.JPG'
  },
]


export const FeaturedArtists: React.SFC = () =>
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist} />)}
  </ThreeColumns>
