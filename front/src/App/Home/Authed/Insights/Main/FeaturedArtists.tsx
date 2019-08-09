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

const ArtistLinkBlock = styled.a<{src: string}>`
display: flex;
align-items: center;
text-align: center;
flex-direction: column;
// padding-top: ${bgSize/2}rem;
// padding-left: ${bgSize/12}rem;
padding-bottom: ${bgSize/12}rem;
margin-bottom: 1rem;
text-decoration: none;
height: ${bgSize}rem;
width: 100%;
// width: ${bgSize}rem;
border-radius: 0.5rem;
background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({src}) => src}");
background-position: center center;
background-size: cover;
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
    hover: '18,480 monthly streamers on Spotify',
    name: 'Douchka',
    href: 'https://open.spotify.com/artist/79QKsfh6iw68qfdIijntNh',
    src: 'https://scontent-lax3-1.xx.fbcdn.net/v/t31.0-8/17191851_10155212060869276_3642745785806716490_o.jpg?_nc_cat=101&_nc_oc=AQm7obRvNtQHPFAn24Pxw9dc-i-kpf49WP1x9RcgQoDY7sOsbtfsyIbzlA_SjZWySac&_nc_ht=scontent-lax3-1.xx&oh=a27d38c02061a4265b6811613fc6dc04&oe=5DD87795'
  },
  {
    title: 'Set',
    hover: '59,239 monthly streamers on Spotify',
    name: 'Blac Rabbit',
    href: 'https://open.spotify.com/artist/0UvgR4VckgdEkBhTOjxwCc?si=3vY8K0gOSgCtGtW1cZOKtA',
    src: 'https://f4.bcbits.com/img/0016322553_10.jpg'
  },
  {
    title: 'Liftoff',
    hover: '598, 212 monthly streamers on Spotify',
    name: 'Sugi.wa',
    href: 'https://open.spotify.com/artist/0XUBVuE1odesNug0oKt9Me',
    src: 'https://f4.bcbits.com/img/a1557745303_16.jpg'
  },
]

export const FeaturedArtists: React.SFC = () => 
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist}/>)}
  </ThreeColumns>
