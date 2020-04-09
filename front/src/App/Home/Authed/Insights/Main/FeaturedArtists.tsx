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
    hover: "418 monthly streamers on Spotify",
    name: "Tom the Lion",
    href:
      "https://open.spotify.com/artist/2jmWN7KyREhT8sbISzFaWf?si=bJUkG7BMQPKW13_4wRmfxQ",
    src:
      "https://www.clashmusic.com/sites/default/files/styles/article_feature/public/field/image/RNI-Films-IMG-43645191-60BF-4942-B4AA-A3C163294EBE_V3.jpeg?itok=6XWNeqRa",
  },
  {
    title: "Set",
    hover: "13,978 monthly streamers on Spotify",
    name: "NOBRO",
    href:
      "https://open.spotify.com/artist/5Tomvwat8AxMGd2ewkDNPs?si=PJPO2GEWQoCcJroRaPAf-w",
    src:
      "https://thegauntlet.ca/wp-content/uploads/2020/01/ARTS_NOBRO_ChrisMacArthur-2882-1160x773.jpg",
  },
  {
    title: "Liftoff",
    hover: "168,239 monthly streamers on Spotify",
    name: "nascar aloe",
    href:
      "https://open.spotify.com/artist/03LEDukdM723NRLz4UXeNv?si=GP94fhanRU6jW9HLx7t05A",
    src:
      "https://www.jankysmooth.com/wp-content/uploads/2020/02/568D3286-0100-4260-B6AD-CBA180DB312C.jpeg",
  },
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
