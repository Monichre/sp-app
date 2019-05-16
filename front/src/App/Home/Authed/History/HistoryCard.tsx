import React from 'react';
import { RecentPlaysPlays } from '../../../../types';
import styled from 'styled-components'
import Moment from 'react-moment'
import { SpotifyLogoLink } from '../../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import { NavLink } from 'react-router-dom';

const bgSize = 16

const AlbumBackground = styled.div<{src: string}>`
  content: "";
  position: absolute;
  height: ${bgSize}rem;
  width: ${bgSize}rem;
  z-index: -1;
  background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4) ), url("${({src}) => src}");
  background-repeat: no-repeat;
  border-radius: 1rem;
  background-size: cover;
`

const ArtistAvatar = styled.div<{src: string}>`
  height: ${bgSize/2}rem;
  width: ${bgSize/2}rem;
  border-radius: ${bgSize/2/2}rem;
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({src}) => src}");
  background-size: cover;
  `

const ArtistInfo = styled.div`
`
const ArtistName = styled.div`
  font-size: ${bgSize/12}rem;
  font-weight: 500;
`

const Artist = styled(NavLink)`
  display: flex;
  text-decoration: none;
  ${ArtistInfo} {
    margin-top: ${bgSize/16}rem;
    margin-left: -${bgSize/2/2}rem;
  }
`

const Play = styled.div`
height: ${bgSize * 1.25}rem;
width: ${bgSize * 1.25}rem;
${AlbumBackground} {
  margin-top: ${bgSize/8}rem;
  margin-left: ${bgSize/2/2}rem;
}
`

const Track = styled.div`
  position: relative;
  top: 1rem;
`

const TrackName = styled.div`
  font-size: ${bgSize/10}rem;
  font-weight; 500;
  max-width: ${bgSize}rem;
`

const TrackWhen = styled.div`
  font-weight: 300;
  color: #64d6ee;
`

const TrackAgo = styled.div`
  font-weight: 300;
  font-size: 0.8rem;
  color: #aaa;
`

export const HistoryCard: React.SFC<{play: RecentPlaysPlays, className?: string}> = ({play: {playedAt, track}, className}) => {
  try {
    const artistImgUrl = track.artists[0] && track.artists[0].images[0] && track.artists[0].images[0].url || ''
    const artistSpotifyUrl = track.artists[0] && track.artists[0].external_urls.spotify
    const artistName = track.artists[0] && track.artists[0].name || 'Unnamed Artist'
    const artistId = track.artists[0] && track.artists[0].id
    const albumImg = track.album.images[0] // this should be fixed in graphql return types
    const albumImgUrl = albumImg ? albumImg.url : ''
    return (
      <Play {...{className}}>
        <AlbumBackground {...{src: albumImgUrl}}/>
        {artistId ? <Artist to={`/insights/lifetime/global/personal/artists/${artistId}`}>
          <ArtistAvatar src={artistImgUrl}/>
          <ArtistInfo>
            <ArtistName>{artistName}</ArtistName>
            { artistSpotifyUrl ? <SpotifyLogoLink href={artistSpotifyUrl}/> : ''}
          </ArtistInfo>
        </Artist> : ''}
        <Track>
          <TrackName>{track.name}</TrackName>
          <TrackWhen>
            <Moment format='hh:mma | ddd D MMM'>
              {playedAt}
            </Moment>
          </TrackWhen>
          <TrackAgo>
            <Moment fromNow>
              {playedAt}
            </Moment>
          </TrackAgo>
        </Track>
      </Play>
    )
  } catch (err) {
    throw new Error(`this is fu'd ${JSON.stringify(track, null, 2)}`)
  }

}