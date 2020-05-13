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
    hover: "192 monthly streamers on Spotify",
    name: "Druzy Rose",
    href:
      "https://open.spotify.com/artist/35U1xElwokOIOHuzBRPAMF?si=THyFKt3kTRCThCO4SB0MdQ",
    src:
      "https://scontent.ffcm1-2.fna.fbcdn.net/v/t1.0-9/74229561_675300442878640_4279286499251322880_o.jpg?_nc_cat=104&_nc_sid=e3f864&_nc_ohc=IHPMj3Sg30AAX9S7Hzw&_nc_ht=scontent.ffcm1-2.fna&oh=7baf398c2aad813ddc5eb891b4cb1a59&oe=5EE11A5D",
  },
  {
    title: "Set",
    hover: "170,952 monthly streamers on Spotify",
    name: "Harvio",
    href:
      "https://open.spotify.com/artist/0VCoyPtLDeOvxwvHeCX7Jx?si=xGUoUnvpTy6CGdeA3yR9Ng",
    src:
      "https://d34qmkt8w5wll9.cloudfront.net/commercial-releases/cover_art/jpeg/4395.jpg",
  },
  {
    title: "Liftoff",
    hover: "649,852 monthly streamers on Spotify",
    name: "Zaia",
    href:
      "https://open.spotify.com/artist/1m0t5VYISq6TcyMo7UqLMz?si=zYqjnqwFRnysNgu2HD12-w",
    src:
      "https://thesource.com/wp-content/uploads/2018/04/Barriers-release-press-4.jpeg",
  },
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
