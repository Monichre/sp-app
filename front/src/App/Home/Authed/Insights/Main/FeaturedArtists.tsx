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
    hover: '2,697 monthly streamers on Spotify',
    name: 'The Raddlers',
    href: 'https://open.spotify.com/artist/5OyL9bvMZEYUMtCMjussZ3?si=bFnsZUawSdKr8E7yALFCrw',
    src: 'https://www.arcgis.com/sharing/rest/content/items/5827f57924ab4d1ca7da19f0fb1704e6/resources/1562388224464.jpeg?w=800'
  },
  {
    title: 'Set',
    hover: '34,163 monthly streamers on Spotify',
    name: 'Terr',
    href: 'https://open.spotify.com/artist/79ipwfkZpcwMYwHJdqtGsN?si=jyelrshcQiujPqQqmBRA6A',
    src: 'https://torturetheartistcom.files.wordpress.com/2018/07/terr-hi-res-hands-credit-gustavo-marx.jpg?w=1024'
  },
  {
    title: 'Liftoff',
    hover: '1,082,484 monthly streamers on Spotify',
    name: 'Cass McCombs',
    href: 'https://open.spotify.com/artist/2iUVQjheBnvOt8vaBrxXJz?si=SKlhUiIKTc6dtxzmXpSaXQ',
    src: 'https://media2.fdncms.com/eastbayexpress/imager/cass-mccombs/u/zoom/3061818/music2.jpg'
  },
]


export const FeaturedArtists: React.SFC = () =>
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist} />)}
  </ThreeColumns>
