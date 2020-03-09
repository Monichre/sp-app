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
    hover: "958 monthly streamers on Spotify",
    name: "Barbaro",
    href:
      "https://open.spotify.com/artist/56xyoM0kp95h5kVkAjoOMq?si=YyCUDZH9R7msBh7ll0A-9Q",
    src:
      "https://i1.wp.com/duluthfolkschool.com/wp-content/uploads/2019/11/5d2dfb7caef91.image-Kyle-Ollah.jpg?fit=750%2C500&ssl=1"
  },
  {
    title: "Set",
    hover: "59,677 monthly streamers on Spotify",
    name: "Nana Adjoa",
    href:
      "https://open.spotify.com/artist/2W61gnKGmJykgFSJSvqVCe?si=8neWYz_tQg2-OZm9Dzwf_w",
    src:
      "https://static.stereogum.com/uploads/2018/09/NanaAdjoa_Press1-1536604684-640x960.jpg"
  },
  {
    title: "Liftoff",
    hover: "444,564 monthly streamers on Spotify",
    name: "Joesef",
    href:
      "https://open.spotify.com/artist/28EyduqESEOVMO6vglvaUZ?si=N2FdXhxdR9Wn-QpOMHkr0w",
    src:
      "https://s1.ticketm.net/dam/a/b30/860d965f-2b64-4653-8c5f-62f7da19bb30_1186271_TABLET_LANDSCAPE_LARGE_16_9.jpg"
  }
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
