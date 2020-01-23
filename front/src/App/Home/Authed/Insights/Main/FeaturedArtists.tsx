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
    hover: '144 monthly streamers on Spotify',
    name: 'Jessica Manning',
    href: 'https://open.spotify.com/artist/0k1PAoOCwbcnj96aakriks?si=8cUItye6QC2QlEtnvPu-Ew',
    src: 'https://ksr-ugc.imgix.net/assets/012/350/690/79fb788387af8af9d183c0505511e4ad_original.jpg?ixlib=rb-2.1.0&crop=faces&w=1552&h=873&fit=crop&v=1463756211&auto=format&frame=1&q=92&s=6f7303a892316866e6de75a272c53db0'
  },
  {
    title: 'Set',
    hover: '102,737 monthly streamers on Spotify',
    name: 'ALASKALASKA',
    href: 'https://open.spotify.com/artist/78CgVNlDQMvOVDIrRL84tJ?si=0ujboSHnQ06FYyelROx9sg',
    src: 'http://www.marathonartists.com/wp-content/uploads/2017/05/DSC_8032-copy.jpg'
  },
  {
    title: 'Liftoff',
    hover: '1,801,316 monthly streamers on Spotify',
    name: 'The Blaze',
    href: 'https://open.spotify.com/artist/1Dt1UKLtrJIW1xxRBejjos?si=tS_cFFJKS8SzCeSPxk2tbg',
    src: 'https://ichef.bbci.co.uk/images/ic/960x540/p062d6bp.jpg'
  },
]


export const FeaturedArtists: React.SFC = () =>
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist} />)}
  </ThreeColumns>
