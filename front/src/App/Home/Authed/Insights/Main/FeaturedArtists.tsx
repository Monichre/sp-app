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

// const featuredArtists: FeaturedArtist[] = [
//   {
//     title: 'Ready',
//     hover: 'Artists under 5,000 monthly streamers on Spotify',
//     name: 'Dwynell Roland',
//     href: 'https://open.spotify.com/artist/1Hk2SN1UWBeajoJBNMCial?si=rts66NevRwCNLWU3ZeR9Rw',
//     src: 'https://kyigt1bcans3ofli94di0kch-wpengine.netdna-ssl.com/wp-content/blogs.dir/9/files/2017/04/test-1260x838.jpg',
//   },
//   {
//     title: 'Set',
//     hover: 'Artists under 200,000 monthly streamers on Spotify',
//     name: 'Yam Haus',
//     href: 'https://open.spotify.com/artist/0rSavBIQ6PthnW6brWugNL?si=K7brrhjuQIm4e-s3yHtp3Q',
//     src: 'https://www.minnesotamonthly.com/wp-content/uploads/sites/85/2019/04/Yam-Haus-Downtown-LA_0760.jpg',
//   },
//   {
//     title: 'Liftoff',
//     hover: 'Artists under 2,500,000 monthly streamers on Spotify',
//     name: 'Shallou',
//     href: 'https://open.spotify.com/artist/7C3Cbtr2PkH2l4tOGhtCsk?si=m6kVD_TKRm2-kuGToaIX9g',
//     src: 'https://www.lollapalooza.com/wp-www-lollapalooza-com/wp/wp-content/uploads/2019/03/shallou_85hxmnbnmwi7-bd936831.jpg',
//   },
// ]

// const featuredArtists: FeaturedArtist[] = [
//   {
//     title: 'Ready',
//     hover: 'Artists under 5,000 monthly streamers on Spotify',
//     name: 'I Self Devine',
//     href: 'https://open.spotify.com/artist/6sUO0fwzR9xGArdGmJry6G?si=5nMKKdONQtSY-1V8RBtvRA',
//     src: 'https://storage.googleapis.com/rhymesayers/images/_hero/iself.jpg',
//   },
//   {
//     title: 'Set',
//     hover: 'Artists under 200,000 monthly streamers on Spotify',
//     name: 'Sniffle Party',
//     href: 'https://open.spotify.com/artist/5YJXDPud21d8RrmnHGWNx5?si=xag131JNSc6dNxhcbXVBeg',
//     src: 'https://www.convergeradio.org/wp-content/uploads/2016/10/0007143976_10-770x513.jpg',
//   },
//   {
//     title: 'Liftoff',
//     hover: 'Artists under 2,500,000 monthly streamers on Spotify',
//     name: 'The Preatures',
//     href: 'https://open.spotify.com/artist/5gcDZA9xXCOspWgQilUYIu?si=8MBZHfLERNOrL9c9DoRF3Q',
//     src: 'https://townsquare.media/site/443/files/2015/03/preatures.jpg?w=980&q=75',
//   },
// ]

const featuredArtists: FeaturedArtist[] = [
  {
    title: 'Ready',
    hover: 'Artists under 5,000 monthly streamers on Spotify',
    name: 'The Nunnery',
    href: 'https://open.spotify.com/artist/4Y1mEUeicSLw6bWNjUdQCJ?si=u7iNk7abT0mfrYmkq-VwPg',
    src: 'https://d2l6t8rnjafg4n.cloudfront.net/u/344585/072c04643c8e58526de5cb897f98785a75296131/1100w/photo-jun-12-12-01-15-pm.jpg',
  },
  {
    title: 'Set',
    hover: 'Artists under 200,000 monthly streamers on Spotify',
    name: 'The Comet is Coming',
    href: 'https://open.spotify.com/artist/0Z5FMozvx15nUSUA6a9kkU?si=-xKGF_yhTS2Fq3cwKL60jw',
    src: 'https://f4.bcbits.com/img/0005898581_10.jpg',
  },
  {
    title: 'Liftoff',
    hover: 'Artists under 2,500,000 monthly streamers on Spotify',
    name: 'Polo & Pan',
    href: 'https://open.spotify.com/artist/45yEuthJ9yq1rNXAOpBnqM?si=ylx-bdc3TaG0bdM2ClSTyg',
    src: 'http://fonotekaelektrika.com/wp-content/uploads/2018/11/ft.jpg',
  },
]

export const FeaturedArtists: React.SFC = () => 
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist}/>)}
  </ThreeColumns>
