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
    hover: '138 monthly streamers on Spotify',
    name: 'White Line Darko',
    href: 'https://open.spotify.com/artist/15SK9kKDJJjMuL8K3LbZiA?si=kgviYNHDS8CPJL3hZ7qgQg',
    src: 'https://i1.sndcdn.com/avatars-000511287876-z9zsjt-t500x500.jpg'
  },
  {
    title: 'Set',
    hover: '149,003 monthly streamers on Spotify',
    name: 'Ages and Ages',
    href: 'https://open.spotify.com/artist/3DozezNrsIE37kJJfHhS9M?si=n9O8yLvAQZa9urobuo5nUg',
    src: 'https://image-ticketfly.imgix.net/00/02/63/92/76-og.jpg?w=1800&h=1200'
  },
  {
    title: 'Liftoff',
    hover: '1,102,301 monthly streamers on Spotify',
    name: 'Day Glow',
    href: 'https://open.spotify.com/artist/6eJa3zG1QZLRB3xgRuyxbm?si=jVK77x7HTNmUWnhftp596A',
    src: 'https://images.squarespace-cdn.com/content/v1/5b788d28697a98e17a6d4c7a/1556684200148-FDN2UG17IZJOTJ5KGGXM/ke17ZwdGBToddI8pDm48kEJAlHRYD6ljLjXJc6sfS_l7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QHyNOqBUUEtDDsRWrJLTmoJKo7K7P-K3iDKcb1IjyB9Vx7SOI8VLWnAjJoiseqf2xOujC2Ne5NVJEGRfW4jXz/image4.jpg?format=750w'
  },
]

export const FeaturedArtists: React.SFC = () => 
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist}/>)}
  </ThreeColumns>
