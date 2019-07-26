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


const featuredArtists: FeaturedArtist[] = [
  {
    title: 'Ready',
    hover: 'Artists under 5,000 monthly streamers on Spotify',
    name: 'The Muckers',
    href: 'https://open.spotify.com/artist/19yF7aXJdu5R9rwOAxgQZA?si=HNBB1DqgRoCJSAe5RfcvvQ',
    src: 'https://f4.bcbits.com/img/0014497429_10.jpg'
  },
  {
    title: 'Set',
    hover: 'Artists under 200,000 monthly streamers on Spotify',
    name: 'John Chuck and The Class',
    href: 'https://open.spotify.com/artist/0vL5IeQO8wvyDAq7zu6N96?si=mI3LSnWOQJ6mc0ugrs2bqA',
    src: 'https://static1.squarespace.com/static/55e9a72fe4b014a326acda21/t/5bd739ad7817f7eb119847c9/1540831855498/jctc_019.jpg'
  },
  {
    title: 'Liftoff',
    hover: 'Artists under 2,500,000 monthly streamers on Spotify',
    name: 'Snail Mail',
    href: 'https://open.spotify.com/artist/4QkSD9TRUnMtI8Fq1jXJJe?si=i3fp_YfbQMabvN_X62hCvw',
    src: 'https://media.npr.org/assets/img/2018/03/12/snail-mail---main---credit-to-michael-lavine-f5257760c1a135425cb8dd54b8933b571d02bcbe-s800-c85.jpg'
  },
]

export const FeaturedArtists: React.SFC = () => 
  <ThreeColumns>
    {featuredArtists.map((artist, key) => <ArtistPromoItem key={key} {...artist}/>)}
  </ThreeColumns>
