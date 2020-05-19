import React from "react";
import styled from "styled-components";
import { SpotifyLogoLink } from "../../../../../shared/SpotifyLogoLink/SpotifyLogoLink";
import { Link } from "react-router-dom";

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
`;

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
background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({
  src,
}) => src}");
background-position: center center;
background-size: cover;
`;

export const ArtistName = styled.div`
  font-size: ${bgSize / 6}rem;
  // font-weight: 500;
  font-weight: bold;
  font-family: Righteous;
`;

export const PaddedRight = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const ArtistPromoItem: React.SFC<FeaturedArtist> = ({
  title,
  hover,
  src,
  href,
  name,
}) => (
  <div data-tip={hover}>
    <ArtistLinkBlock data-test="artist-row" target="new" {...{ href, src }}>
      <PaddedRight>
        <SpotifyLogoLink href={href} size="3rem" />
      </PaddedRight>
      <ArtistName data-test="artist-row-name">{name}</ArtistName>
    </ArtistLinkBlock>
  </div>
);

type FeaturedArtist = {
  title: string;
  hover: string;
  name: string;
  href: string;
  src: string;
};

const featuredArtists: FeaturedArtist[] = [
  {
    title: "Ready",
    hover: "2,023 monthly streamers on Spotify",
    name: "Latinta",
    href:
      "https://open.spotify.com/artist/52HsqcRvu3nkNgED7TXaHC?si=a5tza7fLR7mqSBRSjwBQbw",
    src:
      "https://images.prismic.io/sofarlive/3742530c-bfa6-4ba6-8bee-2c2cc1741d56_200503_KL_Latinta_artists_page_headers_3600x3600_v1.jpg?auto=compress,format&rect=0,0,3600,3600&w=3600&h=3600",
  },
  {
    title: "Set",
    hover: "254,321 monthly streamers on Spotify",
    name: "Brooke Annibale",
    href:
      "https://open.spotify.com/artist/1JojxxteIsItgolTdalOb3?si=MtBVc2pCTeyT2Dgir1wAFA",
    src:
      "https://media1.fdncms.com/pittsburgh/imager/u/original/1857930/brooke.jpg",
  },
  {
    title: "Liftoff",
    hover: "1,281,515 monthly streamers on Spotify",
    name: "Yung Lean",
    href:
      "https://open.spotify.com/artist/67lytN32YpUxiSeWlKfHJ3?si=v3g1-YzlR9u8aLUHpdwahw",
    src:
      "https://i-d-images.vice.com/images/2016/05/13/untitled-article-1463136767-body-image-1463136921.jpg?crop=1xw%3A0.3727xh%3B0xw%2C0.0073xh&resize=2000%3A*",
  },
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
