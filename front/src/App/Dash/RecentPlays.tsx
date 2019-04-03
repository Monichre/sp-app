import React, { useRef, useEffect, useState } from 'react';
import { useRecentPlays, RecentPlaysPlays } from '../../types';
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

const PlayItem: React.SFC<{play: RecentPlaysPlays}> = ({play}) => {
  const img = play.track.album.images[2]
  const imgUrl = img ? img.url : ''
  return (
  <Card data-test='play-item'>
   <img src={imgUrl}/>
    <CardTitle data-test='track-name'>
      {play.track.name}
    </CardTitle>
    <CardInfo>
      {play.track.artists.map((a: any, key: any) => <div {...{key}}>{a && a.name}</div>)}
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
    <Note>Last Update: {lastUpdate || 'never'}</Note>
    {recentPlays.map((play, key) => <PlayItem {...{play, key}}/>)}
  </div>
}