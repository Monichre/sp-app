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
    hover: '4,182 monthly streamers on Spotify',
    name: 'Junaco',
    href: 'https://open.spotify.com/artist/6Q3I3yOdG7MhwX6BCWiu0e?si=vxABANyDRR-OQTmyAGV0vQ',
    src: 'https://www.wweek.com/resizer/HvBCEdQ7jORV81pFDyYQQqaKCqI=/1200x0/filters:quality(100)/s3.amazonaws.com/arc-wordpress-client-uploads/wweek/wp-content/uploads/2018/07/17182515/Kay-67-of-77-e1531877215776.jpg'
  },
  {
    title: 'Set',
    hover: '143,853 monthly streamers on Spotify',
    name: 'Yola',
    href: 'https://open.spotify.com/artist/2gqMBdyddvN82dzZt4ZF14?si=FkxJF8q3RdKqkLbtyeKEDw',
    src: 'https://www.nonesuch.com/sites/g/files/g2000005811/f/styles/artist_banner__1180_x_480_/public/201901/yola-header.jpg?itok=AiiClMVX'
  },
  {
    title: 'Liftoff',
    hover: '479,423 monthly streamers on Spotify',
    name: 'Jadu Heart',
    href: 'https://open.spotify.com/artist/7vjRpVXoecwKTEsrb9iscj?si=YQqxTj-bRmKVuBPN_rwbig',
    src: 'https://www.clashmusic.com/sites/default/files/field/image/a777f4a4-287d-4764-8e2e-06af6e4419ed_1523577600.png'
  },
]

export const FeaturedArtists: React.SFC = () => 
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist}/>)}
  </ThreeColumns>
