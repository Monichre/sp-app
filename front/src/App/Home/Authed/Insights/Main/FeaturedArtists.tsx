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

const ArtistLinkBlock = styled.a<{ src: string }>`
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

const ArtistName = styled.div`
  font-size: ${bgSize / 6}rem;
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

const ArtistPromoItem: React.SFC<FeaturedArtist> = ({ title, hover, src, href, name }) =>
  <div data-tip={hover}>
    {/* <BlockTitle>{title}</BlockTitle> */}
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
    hover: '170 monthly streamers on Spotify',
    name: 'Ryan Traster',
    href: 'https://open.spotify.com/artist/7teZWy6PojgN4JRIXQVqhk?si=WnCeVlbCRC-SCpLPKUNA8g',
    src: 'http://stmedia.stimg.co/Ryan_Traster_by_Gab_Stueve.jpg?w=800'
  },
  {
    title: 'Set',
    hover: '90,364 monthly streamers on Spotify',
    name: 'Squid',
    href: 'https://open.spotify.com/artist/685XjGzGztyivfR3fAjoxo?si=KQ5pelCgSleMoTbSVQ8aYg',
    src: 'http://www.newsoundwales.com/wp-content/uploads/2019/04/SQUID+1.jpg'
  },
  {
    title: 'Liftoff',
    hover: '1,013,641 monthly streamers on Spotify',
    name: 'Raveena',
    href: 'https://open.spotify.com/artist/2kQnsbKnIiMahOetwlfcaS?si=rclsdyRCRrKJ7crwEpFGQQ',
    src: 'https://galoremag.com/wp-content/uploads/2018/09/raveena-feature-image-galore-legal-1024x576.jpg'
  },
]

export const FeaturedArtists: React.SFC = () =>
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist} />)}
  </ThreeColumns>
