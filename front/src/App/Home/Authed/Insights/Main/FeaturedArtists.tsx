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
    hover: "9,484 monthly streamers on Spotify",
    name: "Marcus Yates",
    href:
      "https://open.spotify.com/artist/3Yhv9MAKkZA0k3PLTZXlZQ?si=sdwFZiBmRRmlEypln6SWfQ",
    src: "https://pbs.twimg.com/profile_images/923245648043851776/fGgNhbvZ.jpg"
  },
  {
    title: "Set",
    hover: "194,469monthly streamers on Spotify",
    name: "TORRES",
    href:
      "https://open.spotify.com/artist/3lrDYjsghBMfUTiLziD9q9?si=Om9ZmcDzT8qeTYcH8AVq-w",
    src:
      "https://mediad.publicbroadcasting.net/p/wabe/files/styles/x_large/public/201506/Torres_062315.jpg"
  },
  {
    title: "Liftoff",
    hover: "1,928,298 monthly streamers on Spotify",
    name: "Whitney",
    href:
      "https://open.spotify.com/artist/32aUoW94mJ7xTJI7fG0V1G?si=SMONuKUMRWSJgjKytYjBuA",
    src:
      "https://images.squarespace-cdn.com/content/57b314e846c3c465f615bdd6/1478723698886-A1XXD5L14IL2O7ZALYG3/SO+IT+GOES+X+WHITNEY-6.jpg?format=1500w&content-type=image%2Fjpeg"
  }
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
