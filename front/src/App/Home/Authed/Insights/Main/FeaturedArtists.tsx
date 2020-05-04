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
    hover: "12,341 monthly streamers on Spotify",
    name: "ELLES",
    href:
      "https://open.spotify.com/artist/6EbSbVKlRuKxfIfr8H7mCo?si=r1-fo46LTBSp7xZ8czUIQg",
    src: "https://f4.bcbits.com/img/a2677796609_10.jpg",
  },
  {
    title: "Set",
    hover: "126,551 monthly streamers on Spotify",
    name: "MIKE",
    href:
      "https://open.spotify.com/artist/1wlzPS1hSNrkriIIwLFTmU?si=6xx1y36kScycd8C73qFNPw",
    src: "https://cdn3.pitchfork.com/longform/599/Mike1.jpg",
  },
  {
    title: "Liftoff",
    hover: "295,939 monthly streamers on Spotify",
    name: "Vagabon",
    href:
      "https://open.spotify.com/artist/17mwzDXKn4ra9cuxXaptwp?si=6zuY75GKSiipm-mqNDdr9gA",
    src: "https://guitar.com/wp-content/uploads/2019/08/vagabon@1400x1050.jpg",
  },
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
