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
    hover: '952 monthly streamers on Spotify',
    name: 'YYY',
    href: 'https://open.spotify.com/artist/5NaRtpIiM6r54JmJ6AFWta?si=BnvQOER0T--FR4NP52hO5w',
    src: 'https://stmedia.stimg.co/ctyp-yyyyyyy.jpg?w=800'
  },
  {
    title: 'Set',
    hover: '106,151 monthly streamers on Spotify',
    name: 'Amyl and The Sniffers',
    href: 'https://open.spotify.com/artist/3NqV2DJoAWsjl787bWaHW7?si=hJp2-rVSSHOkaABVxR0Ndg',
    src: 'https://diy-magazine.s3.amazonaws.com/d/diy/Artists/A/Amyl-and-the-Sniffers/DIY85/Amyl-and-the-Sniffers_c_Charles-Engelken-03-web.jpg'
  },
  {
    title: 'Liftoff',
    hover: '756,118 monthly streamers on Spotify',
    name: 'Caroline Polachek',
    href: 'https://open.spotify.com/artist/4Ge8xMJNwt6EEXOzVXju9a?si=ZKtPBjc6RE6vAytUA24tWA',
    src: 'https://mtv.mtvnimages.com/uri/mgid:ao:image:mtv.com:683351?quality=0.8&format=jpg&width=1440&height=810&.jpg'
  },
]


export const FeaturedArtists: React.SFC = () =>
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist} />)}
  </ThreeColumns>
