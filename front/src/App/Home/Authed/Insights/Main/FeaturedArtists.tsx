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
    hover: "1,200 monthly streamers on Spotify",
    name: "Queen Moo",
    href:
      "https://open.spotify.com/artist/6c6Nk6a7Xk5t8NVWRnNonq?si=dyYycUUBTU6NmTjPoPfmlw",
    src: "https://s9.limitedrun.com/images/1244474/queenmoo_website.jpg",
  },
  {
    title: "Set",
    hover: "108,344 monthly streamers on Spotify",
    name: "Muzz",
    href:
      "https://open.spotify.com/artist/4nZTcwItN2j9H21sJBZ2Nq?si=42hhTZelTVmKkOKWjxZ8ww",
    src:
      "https://www.rollingstone.com/wp-content/uploads/2020/03/Muzz_byDrielyS-000485810006.jpg",
  },
  {
    title: "Liftoff",
    hover: "1,857,931 monthly streamers on Spotify",
    name: "Nebu Kiniza",
    href:
      "https://open.spotify.com/artist/5lCY3tqdQxbeg5igSlObaT?si=oTyC_8DXQZyo7Fj03-5hmA",
    src: "https://idolwiki.com/pics/NebuKiniza/NebuKiniza.jpg",
  },
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
