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
    hover: "155,313 monthly streamers on Spotify",
    name: "Nubya Garcia",
    href:
      "https://open.spotify.com/artist/6O5k8LLRfDK8v9jj1GazAQ?si=OfOauefwSUOjeVWejePtFw&dl_branch=1&nd=1",
    src:
      "https://cdn2.jazztimes.com/2020/09/nubya-garcia-adama-jalloh.jpg",
  },
  {
    title: "Set",
    hover: "167,815 monthly streamers on Spotify",
    name: "Doc Robinson",
    href:
      "https://open.spotify.com/artist/5O0efDEpkqEmWbXD2zpkjz?si=XB6ye6J7S-yA9hwTm3n5IQ&dl_branch=1&nd=1",
    src:
      "http://volumemagazine.net/wp-content/uploads/2016/12/DSCF1101-1038x576-1000x576.jpg",
  },
  {
    title: "Liftoff",
    hover: "946,874 monthly streamers on Spotify",
    name: "Dreamer Boy",
    href:
      "https://open.spotify.com/artist/1UJKiAI4Evnhh1ExDse25D?si=P3U3PBiLT9SWBziQ1ZTQgg&dl_branch=1&nd=1",
    src:
      "https://readdork.com/wp-content/uploads/2020/11/dreamer-boy-nov20-47.jpg",
  },
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
