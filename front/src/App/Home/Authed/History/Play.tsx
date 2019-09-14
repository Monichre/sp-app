import React from 'react';
import { RecentPlaysPlays } from '../../../../types';
import styled from 'styled-components'
import Moment from 'react-moment'
import { SpotifyLogoLink } from '../../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import { NavLink } from 'react-router-dom';

export const bgSize = 16

export const AlbumBackgroundDiv = styled.div<{src: string}>`
  content: "";
  position: absolute;
  height: ${bgSize}rem;
  width: ${bgSize}rem;
  z-index: 0;
  background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4) ), url("${({src}) => src}");
  background-repeat: no-repeat;
  border-radius: 1rem;
  background-size: cover;
`

export const ArtistAvatarDiv = styled.div<{src: string}>`
  height: ${bgSize/2}rem;
  width: ${bgSize/2}rem;
  border-radius: ${bgSize/2/2}rem;
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({src}) => src}");
  background-size: cover;
  position: relative;
  z-index: 1;
  `

export const ArtistInfoDiv = styled.div`
`
export const ArtistNameDiv = styled.div`
  font-size: ${bgSize/12}rem;
  font-weight: 500;
  position: relative;
  z-index: 1;
`

export const ArtistNavLink = styled(NavLink)`
  display: flex;
  text-decoration: none;
  ${ArtistInfoDiv} {
    margin-top: ${bgSize/16}rem;
    margin-left: -${bgSize/2/2}rem;
  }
`

export const PlayDiv = styled.div`
height: ${bgSize * 1.25}rem;
width: ${bgSize * 1.25}rem;
${AlbumBackgroundDiv} {
  margin-top: ${bgSize/8}rem;
  margin-left: ${bgSize/2/2}rem;
}
`

export const TrackDiv = styled.div`
  position: relative;
  top: 1rem;
`

export const TrackNameDiv = styled.div`
  font-size: ${bgSize/10}rem;
  font-weight: 500;
  color: #fff;
  max-width: ${bgSize}rem;
`

export const TrackWhenDiv = styled.div`
  font-weight: 300;
  color: #64d6ee;
`

const TrackAgoMoment = styled(Moment)`
  font-weight: 300;
  font-size: 0.8rem;
  color: #aaa;
`

export const Play: React.SFC<{play: RecentPlaysPlays, className?: string}> = ({play: {playedAt, track}, className}) => {
  try {
    const artistImgUrl = track.artists[0] && track.artists[0].images[0] && track.artists[0].images[0].url || ''
    const artistSpotifyUrl = track.artists[0] && track.artists[0].external_urls.spotify
    const artistName = track.artists[0] && track.artists[0].name || 'Unnamed Artist'
    const artistId = track.artists[0] && track.artists[0].id
    const albumImg = track.album.images[0] // this should be fixed in graphql return types
    const albumImgUrl = albumImg ? albumImg.url : ''
    return (
      <PlayDiv {...{className}}>
        <AlbumBackgroundDiv {...{src: albumImgUrl}}/>
        {artistId ? <ArtistNavLink to={`/insights/lifetime/global/personal/artists/${artistId}`}>
          <ArtistAvatarDiv src={artistImgUrl}/>
          <ArtistInfoDiv>
            <ArtistNameDiv>{artistName}</ArtistNameDiv>
            { artistSpotifyUrl ? <SpotifyLogoLink href={artistSpotifyUrl}/> : ''}
          </ArtistInfoDiv>
        </ArtistNavLink> : ''}
        <TrackDiv>
          <TrackNameDiv>{track.name}</TrackNameDiv>
          <TrackWhenDiv>
            <Moment format='hh:mma | ddd D MMM'>
              {playedAt}
            </Moment>
          </TrackWhenDiv>
          <TrackAgoMoment fromNow date={playedAt}/>
        </TrackDiv>
      </PlayDiv>
    )
  } catch (err) {
    throw new Error(`this is fu'd ${JSON.stringify(track, null, 2)}`)
  }

}