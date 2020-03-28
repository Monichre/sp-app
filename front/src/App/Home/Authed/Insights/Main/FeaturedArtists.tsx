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
    hover: "18,703 monthly streamers on Spotify",
    name: "Chappaqua Wrestling",
    href:
      "https://open.spotify.com/artist/5S4qUw22ZF7gTPUEx61SyC?si=yF2wHKF6TguxPKSoS58m6w",
    src: "https://f4.bcbits.com/img/0011461584_10.jpg"
  },
  {
    title: "Set",
    hover: "639,834 monthly streamers on Spotify",
    name: "(Sandy) Alex G",
    href:
      "https://open.spotify.com/artist/6lcwlkAjBPSKnFBZjjZFJs?si=XRy-wXzTRv6eIyofRvRqoA",
    src:
      "https://img.apmcdn.org/b70fe93a07870a989e35cc132ec1d8af2113b901/uncropped/30ca1b-20190909-sandy-alex-g.jpg"
  },
  {
    title: "Liftoff",
    hover: "2,014,129 monthly streamers on Spotify",
    name: "Beach Bunny",
    href: "https://open.spotify.com/artist/2vnB6tuQMaQpORiRdvXF9H",
    src:
      "https://cdn2.thelineofbestfit.com/images/made/images/remote/https_cdn2.thelineofbestfit.com/media/2014/Beach_Bunny_1_1290_1290.jpg"
  }
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
