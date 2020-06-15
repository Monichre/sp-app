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
    hover: "16,523 monthly streamers on Spotify",
    name: "Onipa",
    href:
      "https://open.spotify.com/artist/3M4siMIW7Pm9cT4jb1oNb5?si=i-tqiobhTOmbBe6FV2ZQGw",
    src:
      "https://scontent-msp1-1.xx.fbcdn.net/v/t1.0-9/s960x960/89895636_769578163573631_7199228141515046912_o.jpg?_nc_cat=109&_nc_sid=8024bb&_nc_oc=AQl8sfD0AqIkT5vlL0UHWTLg-Uh9NeojKIMDbUzUph13yWydPXYsvEFb6wuEkSs7Oj0&_nc_ht=scontent-msp1-1.xx&_nc_tp=7&oh=9081f2a08e4c3591cc2263db7b8420ee&oe=5EF170A6",
  },
  {
    title: "Set",
    hover: "167,815 monthly streamers on Spotify",
    name: "Rahli",
    href:
      "https://open.spotify.com/artist/6WwVzGJQWr2jU3iBgl8WPm?si=FJ9Z4euKRZaF3VxN6KMGtA",
    src:
      "https://elevator-media.imgix.net/2019/10/Rahli.jpg?fit=scale&fm=pjpg&h=650&ixlib=php-1.2.1&w=600&wpsize=medium&s=ed6bb671bac611b6b3bea99e2a7a3535",
  },
  {
    title: "Liftoff",
    hover: "221,458 monthly streamers on Spotify",
    name: "salute",
    href:
      "https://open.spotify.com/artist/1np8xozf7ATJZDi9JX8Dx5?si=KKaSTp4PSs--eG386ZIeEw",
    src:
      "https://scontent-msp1-1.xx.fbcdn.net/v/t31.0-0/p640x640/13227419_1314842381877077_303597481520075945_o.jpg?_nc_cat=100&_nc_sid=7aed08&_nc_oc=AQkwwq21Qq-1RmUcx0l-2okKtRPqfjGmaXMfMQjxcAE1nt6d99tWBzaoFVSpVAd8r6U&_nc_ht=scontent-msp1-1.xx&_nc_tp=6&oh=8279777463a0a312d1ec97ad3d0f5f8e&oe=5EF3C81B",
  },
];

export const FeaturedArtists: React.SFC = () => (
  <ThreeColumns>
    {featuredArtists.map((artist, key) => (
      <ArtistPromoItem key={key} {...artist} />
    ))}
  </ThreeColumns>
);
