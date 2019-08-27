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
    hover: '253 monthly streamers on Spotify',
    name: 'KayelaJ',
    href: 'https://open.spotify.com/artist/0dYsGdodqIEZxY4PYR9yMQ?si=5faqz-DwQLKumrxhZWeE2w',
    src: 'https://www.wweek.com/resizer/HvBCEdQ7jORV81pFDyYQQqaKCqI=/1200x0/filters:quality(100)/s3.amazonaws.com/arc-wordpress-client-uploads/wweek/wp-content/uploads/2018/07/17182515/Kay-67-of-77-e1531877215776.jpg'
  },
  {
    title: 'Set',
    hover: '75,879 monthly streamers on Spotify',
    name: 'Bodega',
    href: 'https://open.spotify.com/artist/3lnWfdMG9U0oVMC15SEbB5?si=R7R0DwXkRBSqZ7qgmRDjVQ',
    src: 'https://ksassets.timeincuk.net/wp/uploads/sites/55/2018/07/BODEGA-EVL-4-920x584.jpg'
  },
  {
    title: 'Liftoff',
    hover: '744, 959 monthly streamers on Spotify',
    name: 'Bilderbuch',
    href: 'https://open.spotify.com/artist/2ErWLckuGFl84nGmg5fwyG?si=6iO1s3dNRiSg-b1JFQkvlw',
    src: 'https://tubestatic.orf.at/static/images/site/tube/20170520/x_l1005793.5607155.jpg'
  },
]

export const FeaturedArtists: React.SFC = () =>
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist} />)}
  </ThreeColumns>
