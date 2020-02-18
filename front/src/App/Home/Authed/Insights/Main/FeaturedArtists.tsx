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
    hover: "7,289 monthly streamers on Spotify",
    name: "Ajimal",
    href:
      "https://open.spotify.com/artist/3j4ew45VN7knFiJvjqBobA?si=T5HUvQTNSbmlk-_fSRuPEQ",
    src:
      "https://www.tmrwmagazine.com/wp-content/uploads/2020/02/Screen-Shot-2020-02-04-at-3.19.57-PM-min.jpg"
  },
  {
    title: "Set",
    hover: "30,024 monthly streamers on Spotify",
    name: "Miloe",
    href:
      "https://open.spotify.com/artist/3HdQTgQSncptIPjDgskWbu?si=ZvDV47SRSRG8NbXn485uJQ",
    src:
      "https://walker-web.imgix.net/cms/m3.jpg?w=740&fit=clip&auto=format,compress&dpr=1.5"
  },
  {
    title: "Liftoff",
    hover: "909,814 monthly streamers on Spotify",
    name: "Tennis",
    href:
      "https://open.spotify.com/artist/1ybAN3utgdoUL1MUCtH4QM?si=ms7w5EL5Rym6etYxeE4dOA",
    src:
      "https://i1.wp.com/citysoundcheck.com/wp-content/uploads/2017/11/032217-tennis-band-embed-2.jpg?ssl=1"
  }
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
