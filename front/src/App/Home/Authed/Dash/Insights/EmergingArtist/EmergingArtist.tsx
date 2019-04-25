import React from 'react';
import styled from 'styled-components'

const TwoColumns = styled.div`
  margin: 2rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  align-items: center;
`

const Block = styled.div`
  margin-top: 1rem;
`

type Artist = {
  name: string
  playDurationMs: number
}

const bgSize = 24;

const ArtistAvatar = styled.div<{src: string}>`
  height: ${bgSize}rem;
  width: 100%;
  // width: ${bgSize}rem;
  border-radius: ${bgSize/4}rem;
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({src}) => src}");
  background-position: center center;
  background-size: cover;
`

const ArtistTime = styled.div`
  display: flex;
  align-items: baseline;
  & > * {
    margin-right: 0.5rem;
  }
`

const ArtistInfo = styled.div`
  margin-top: ${bgSize/2}rem;
  margin-left: -${bgSize*3/4}rem;
  padding-right: -${bgSize*3/4}rem;
`

const MajorValue = styled.div`
  font-weight: 500;
  font-size: 2rem;
`

const MinorValue = styled.div`
font-size: 1.33rem;
font-weight: 500;
color: #64d6ee;
`

const ArtistName = styled.div`
  font-size: ${bgSize/6}rem;
  // font-weight: 500;
  font-weight: bold;
`



const ArtistLinkBlock = styled.a<{src: string}>`
display: flex;
align-items: flex-end;
// padding-top: ${bgSize/2}rem;
padding-left: ${bgSize/8}rem;
padding-bottom: ${bgSize/8}rem;
text-decoration: none;
height: ${bgSize}rem;
width: 100%;
// width: ${bgSize}rem;
border-radius: 0.5rem;
background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({src}) => src}");
background-position: center center;
background-size: cover;
`

const HeroBlock = styled.div`
  // text-transform: uppercase;
  text-align: right;
  padding-top: 2rem;
  font-weight: 500;
  font-size: 4rem;
  color: #999;
  line-height: 140%;
  @media (max-width: 600px) {
    font-size: 3rem;
    text-align: center;
    padding-top: 0;
    padding-bottom: 1rem;
  }
`

const Foo = 1


const ArtistPromoItem: React.SFC<{src: string, href: string, name: string }> =  ({src, href, name}) =>
<ArtistLinkBlock data-test='artist-row' target='new' {...{href, src}}>
  <ArtistName data-test='artist-row-name'>{name}</ArtistName>
</ArtistLinkBlock>

export const EmergingArtist: React.SFC = () => {
  const artist = {
    name: 'Bad Bad Hats',
    href: 'https://open.spotify.com/artist/2bstapBmz5M83elQvPnwp6?si=xy4DUgwSTpqxN3yi1kMnLg',
    src: 'https://images.sxsw.com/HdmxpJuNKtoeQGueUUWgNBA16KA=/396x605:3468x2799/950x0/images.sxsw.com/54/027dad2b-1146-43e7-98d9-5d089be4b9f3/artist-27371',
  }
  return (
    <TwoColumns>
      <HeroBlock>
      Featured<br/>Emerging<br/>Artist
      </HeroBlock>
      <ArtistPromoItem {...artist}/>
    </TwoColumns>
  )
}
