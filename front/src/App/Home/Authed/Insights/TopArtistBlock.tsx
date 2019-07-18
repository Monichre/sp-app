import React from 'react';
import styled from 'styled-components'
// import { PlaytimeSummaryTopLifetimeArtists } from '../../../../types';
import { NavLink } from 'react-router-dom';
import { SpotifyLogoLink } from '../../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import { hrsAndMinsAndSecs } from '../../../../lib/durationFormats';

const BlockTitle = styled.div`
  display: flex;
  align-items: flex-end;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 1.2rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #64d6ee;

  & > * {
    margin-right: 0.5rem;
  }
`

const LeftRow = styled.div`
  display: flex;
  align-items: baseline;
  & > * {
    margin-right: 0.5rem;
  }
`

const MajorValue = styled.div`
  font-weight: 500;
  font-size: 40px;
`

const MinorValue = styled.div`
font-size: 30px;
font-weight: 500;
color: #64d6ee;
`


const ArtistTitle = styled.div`
  display: flex;
  align-items: baseline;
  font-weight: 500;
  font-size: 1.5rem;

  & > * {
    margin-right: 0.5rem;
  }
`

const NavBlock = styled(NavLink)`
display: block;
text-decoration: none;
padding: 1rem;
margin: 0rem;
& > * {
  margin-bottom: 1rem;
}
`

const ImageBlock = styled(NavBlock)<{src: string}>`
  height: 100%;
  background-image: url("${({src}) => src}");
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({src}) => src}");
  background-position: center center;
  background-size: cover;
  border-radius: 0.5rem;

  & > * {
    margin-bottom: 0.5rem;
  }
`

export const TopArtistBlock: React.SFC<{className?: string, stat: any}> =
  ({ className, stat: { playDurationMs, artist: { id, name, images, external_urls: { spotify }, ...rest } } }) => {
    
    console.log(rest)

    const { hrs, mins } = hrsAndMinsAndSecs(playDurationMs)
    const imgUrl = images[0] && images[0].url
    return (
      <ImageBlock {...{className}} src={imgUrl} to={`/artist/${id}`}>
        <LeftRow>
          <MajorValue>{hrs} hrs</MajorValue>
          <MinorValue>{mins} mins</MinorValue>
        </LeftRow>
        <ArtistTitle><div>{name}</div><SpotifyLogoLink href={spotify}/> </ArtistTitle>
        <BlockTitle>Your All-time Top</BlockTitle>
      </ImageBlock>
    )
  }
