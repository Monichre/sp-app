import React from "react";
import styled from "styled-components";
import { SpotifyLogoLink } from "../../../../../shared/SpotifyLogoLink/SpotifyLogoLink";

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
  src
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
  name
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
    hover: "410 monthly streamers on Spotify",
    name: "Tongue Party",
    href:
      "https://open.spotify.com/artist/5ZN5lbKQ8D0uwWmDRLVmJG?si=h_5wzStRSayLF6ASpmUOUA",
    src: "https://f4.bcbits.com/img/0013490120_10.jpg"
  },
  {
    title: "Set",
    hover: "386,959 monthly streamers on Spotify",
    name: "Oneohtrix Point Never",
    href:
      "https://open.spotify.com/artist/2wPDbhaGXCqROrVmwDdCrK?si=ZKjaB8cuSqa15UyN9cmXcg",
    src:
      "https://shorefire.com/images/uploads/gallery/OPN_5_AtibaJefferson_3000.jpg"
  },
  {
    title: "Liftoff",
    hover: "817,668 monthly streamers on Spotify",
    name: "Leikeli47",
    href:
      "https://open.spotify.com/artist/0DtXHIvJ8NWBg5pGvsgWnR?si=HUuaJ3okT6GncUfRh4p9-A",
    src:
      "https://media1.popsugar-assets.com/files/thumbor/QOZB5sCAuhoVezHXM-tE4Hz7jFQ/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2019/08/16/723/n/1922283/tmp_mEr4Im_9b4f8fe89af41965_051319-Skullcandy-Empowered-Pink-Leikeli474820.jpg"
  }
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
