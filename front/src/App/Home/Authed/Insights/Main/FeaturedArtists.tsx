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
padding-bottom: ${bgSize/12}rem;
margin-bottom: 1rem;
text-decoration: none;
height: ${bgSize}rem;
width: 100%;
border-radius: 0.5rem;
position: relative;
/* background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({ src }) => src}"); */


  &::after {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    height: 100%;
    width: 100%;
    border-radius: 0.5rem;
      background: linear-gradient(179deg, rgba(3,6,22,0.00) 0%, rgba(3,6,22,0.02) 43%, #030616 79%), url("${({ src }) => src}");
  background-size: cover;
  opacity: 0.5;
  background-position: center center;
  }
/* background-image: radial-gradient(56% 148%, rgba(3,6,22,0.00) 54%, rgba(3,6,22,0.95) 100%);
background-image: linear-gradient(179deg, rgba(3,6,22,0.00) 0%, rgba(3,6,22,0.02) 43%, #030616 79%); */
/* background-image: linear-gradient(90deg, rgba(3,6,22,0.00) 2%, #030616 100%); */

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
    name: 'Panther Ray',
    href: 'https://open.spotify.com/artist/7ug6ifTZ4titqyrx3uagxD?si=KxPWNARWTBymwb3sy7Q3ug',
    src: 'https://f4.bcbits.com/img/0013035999_10.jpg',
  },
  {
    title: 'Set',
    hover: 'Artists under 200,000 monthly streamers on Spotify',
    name: 'Ibibio Sound Machine',
    href: 'https://open.spotify.com/artist/4J6CnIqPEtWYn3la2YYj2c?si=TUpmCIq9SeOUy4r-18DQ4g',
    src: 'https://ichef.bbci.co.uk/images/ic/960x540/p01w8c8s.jpg',
  },
  {
    title: 'Liftoff',
    hover: 'Artists under 2,500,000 monthly streamers on Spotify',
    name: 'Dorothy',
    href: 'https://open.spotify.com/artist/6IOvhXyk5edbA2DVaeP9Up?si=ziul84YCQEmjYK2sm37bBA',
    src: 'http://stereochampions.com/wp-content/uploads/2016/06/dorothy.jpg',
  },
]

export const FeaturedArtists: React.SFC = () => 
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist}/>)}
  </ThreeColumns>
