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
    hover: '1,590 monthly streamers on Spotify',
    name: 'Fizzy Soup',
    href: 'https://open.spotify.com/artist/4H9JKsK80UHLurX3TeYDD0?si=jCjdRbNfQGeNBP_aIlkU3Q',
    src: 'https://www.segundopremio.com/wp-content/uploads/2019/04/Fizzy-Soup-1024x640.jpg'
  },
  {
    title: 'Set',
    hover: '200,022 monthly streamers on Spotify',
    name: 'Paul Cauthen',
    href: 'https://open.spotify.com/artist/6yHM0XQEdu9sIlbILMaKBp?si=DHQR16D4Sfynyj76XYFCkA',
    src: 'https://thebluegrasssituation.com/wp-content/uploads/2018/09/Paul-Cauthen.jpg'
  },
  {
    title: 'Liftoff',
    hover: '452,051 monthly streamers on Spotify',
    name: 'Jamila Woods',
    href: 'https://open.spotify.com/artist/4UodukR17NIQfNu5uaqm9B?si=gER86qUGQv2pc9NcNUbuAQ',
    src: 'https://static01.nyt.com/images/2019/05/15/arts/15ALBUM-WOODS/merlin_154875852_f2d63d5e-5b8e-48f9-b9b5-e015165c3f46-articleLarge.jpg?quality=75&auto=webp&disable=upscale'
  },
]


export const FeaturedArtists: React.SFC = () =>
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist} />)}
  </ThreeColumns>
