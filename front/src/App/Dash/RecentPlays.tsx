import React, { useRef, useEffect, useState } from 'react';
import { useRecentPlays, RecentPlaysPlays, RecentPlaysArtists, RecentPlaysAlbum, RecentPlaysTrack } from '../../types';
import styled from 'styled-components'
import Moment from 'react-moment'

const Card = styled.div`
  padding: 1rem;
  margin: 0 0.5rem 0.25rem 0.5rem;
`

const CardTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`

const CardInfo = styled.div`
  font-style: italic;
`
const CardAlert = styled(Card)`
  background-color: #666;
`

const AvatarImg = styled.img`
  height: 2rem;
  width: 2rem;
  border-radius: 1rem;
`

const ArtistLabel: React.SFC<{artist: any}> = ({artist}) =>
  <div>
    <AvatarImg src={artist.images[0] && artist.images[0].url}/>
    <div>{artist.name}</div>
    {artist.genres.map((g: any, key: string) => <span {...{key}}>{g}&nbsp;</span>)}
  </div>

const xPlayItem: React.SFC<{play: RecentPlaysPlays}> = ({play}) => {
  const img = play.track.album.images[2] || play.track.album.images[0]
  const imgUrl = img ? img.url : ''
  return (
  <Card data-test='play-item'>
   <img src={imgUrl}/>
    <CardTitle data-test='track-name'>
      {play.track.name}
    </CardTitle>
    <CardInfo>
      {play.track.artists.map((artist: any, key: any) => <ArtistLabel {...{key, artist}}/>)}
    </CardInfo>
    <Moment fromNow>
      {play.playedAt}
    </Moment>
    <br/>
    <Moment format='ddd D MMM h:mm a'>
      {play.playedAt}
    </Moment>
  </Card>
  )
}

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
`

const ArtistAvatar = styled.div<{src: string}>`
  height: ${bgSize/2}rem;
  width: ${bgSize/2}rem;
  border-radius: ${bgSize/2/2}rem;
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({src}) => src}");
  `

const ArtistName = styled.div`
  font-size: ${bgSize/12}rem;
  font-weight: 500;
`

const Artist = styled.div`
  display: flex;
  ${ArtistName} {
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

const TrackAgo = styled.div`
  font-weight: 300;
  color: #64d6ee;
`

const PlayItem: React.SFC<{play: RecentPlaysPlays, className?: string}> = ({play: {playedAt, track}, className}) => {
  const artistImgUrl = track.artists[0].images[0] && track.artists[0].images[0].url || ''
  const albumImg = track.album.images[0] // this should be fixed in graphql return types
  const albumImgUrl = albumImg ? albumImg.url : ''
  return (
    <Play {...{className}}>
      <AlbumBackground {...{src: albumImgUrl}}/>
      <Artist>
        <ArtistAvatar src={artistImgUrl}/>
        <ArtistName>{track.artists[0].name}</ArtistName>
      </Artist>
      <Track>
        <TrackName>{track.name}</TrackName>
        <TrackAgo>
          <Moment fromNow>
            {playedAt}
          </Moment>
        </TrackAgo>
      </Track>
    </Play>
  )
}
// thought i needed this for graphql polling, dont
// may still need it for heartbeat mutation
// const useInterval = (callback: () => any, delay: number) => {
//   const callbackRef = useRef<()=>{}>()

//   useEffect(() => {
//     callbackRef.current = callback
//   })

//   useEffect(() => {
//     const tick = () => callbackRef.current && callbackRef.current()
//     const id = setInterval(tick, delay)
//     return () => clearInterval(id)
//   }, [delay])
// }

const Note = styled.div`
  padding: 0 1.5rem;
  font-size: 0.75rem;
  font-weight: 300;
  color: #AAA !important;
`

const PlayGrid = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: 25% 25% 25% 25%;
  @media (max-width: 1000px) {
    grid-template-columns: 33% 33% 33%;
  }
  @media (max-width: 800px) {
    grid-template-columns: 50% 50%;
  }
  @media (max-width: 600px) {
    grid-template-columns: 100%;
  }
`

export const RecentPlays: React.SFC<{uid: string}> = ({uid}) => {
  const [pollInterval, setPollInterval] = useState(2000)
  const { data } = useRecentPlays({ variables: { uid }, suspend: true, pollInterval})
  console.log('data', data)
  const recentPlays = data && data.recentPlays && data.recentPlays.plays || []
  const lastUpdate = data && data.recentPlays && data.recentPlays.lastUpdate
  useEffect(() => setPollInterval(lastUpdate ? 10000 : 3000), [lastUpdate])
  
  if (!lastUpdate) {
    return <CardAlert>Interrogating Spotify about your listening...</CardAlert>
  }
  if (lastUpdate && recentPlays.length === 0) {
    return <CardAlert data-test="alert-no-history">You don't seem to have any history in spotify.  Go listen to something!</CardAlert>
  }
  
  return <div data-test="play-timeline">
    <PlayGrid>
      {recentPlays.map((play, key) => <PlayItem {...{play, key}}/>)}
    </PlayGrid>
    <Note>Last Update: {lastUpdate || 'never'}</Note>
  </div>
}