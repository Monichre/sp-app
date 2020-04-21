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
    hover: "8,696 monthly streamers on Spotify",
    name: "BRETT NEWSKI",
    href:
      "https://open.spotify.com/artist/7jukMDCSMJSIcdlsKJ44IW?si=bPxnZiVxRSqUXioqF7_HKQ",
    src:
      "https://s3.amazonaws.com/radiomilwaukee-wordpress-uploads/wp-content/uploads/2020/02/05172506/NEWSKI-orange-WEB-cred-Kelly-bolter-1480x987.jpg",
  },
  {
    title: "Set",
    hover: "7,638 monthly streamers on Spotify",
    name: "NOVACUB",
    href:
      "https://open.spotify.com/artist/5AgzqwERKzaLXw6wSL5LcO?si=dgV5gLmWS3GoEADyFn_E9Q",
    src:
      "https://assets.bigcartel.com/account_images/2536034/BIGCARTEL.jpg?auto=format&fit=max&h=1200&w=1200",
  },
  {
    title: "Liftoff",
    hover: "534,301 monthly streamers on Spotify",
    name: "Remi Wolf",
    href:
      "https://open.spotify.com/artist/0NB5HROxc8dDBXpkIi1v3d?si=WxKOXMMfSp-OtBgIyjZPUg",
    src:
      "https://diy-magazine.s3.amazonaws.com/d/diy/Artists/R/Remi-Wolf/_landscape/358486/Screenshot-2020-04-08-at-16.49.11.jpg",
  },
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
