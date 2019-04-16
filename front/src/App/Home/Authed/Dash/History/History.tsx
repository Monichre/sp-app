import React, { useEffect, useState } from 'react';
import { useRecentPlays } from '../../../../../types';
import styled from 'styled-components'
import { HistoryCard } from './HistoryCard';

const Card = styled.div`
  padding: 1rem;
  margin: 0 0.5rem 0.25rem 0.5rem;
`

const CardAlert = styled(Card)`
  background-color: #666;
`

const Note = styled.div`
  padding: 0 1.5rem;
  font-size: 0.75rem;
  font-weight: 300;
  color: #AAA !important;
`

const HistoryGrid = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: 25% 25% 25% 25%;
  @media (max-width: 1200px) {
    grid-template-columns: 33% 33% 33%;
  }
  @media (max-width: 1000px) {
    grid-template-columns: 50% 50%;
  }
  @media (max-width: 800px) {
    grid-template-columns: 100%;
  }
`

export const History: React.SFC<{uid: string}> = ({uid}) => {
  const [pollInterval, setPollInterval] = useState(2000)
  const { data, error, errors } = useRecentPlays({ variables: { uid }, suspend: true, pollInterval})
  if (error) { throw new Error(JSON.stringify(error)) }
  if (errors) { throw new Error(JSON.stringify(errors)) }

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
    <HistoryGrid>
      {recentPlays.map((play, key) => <HistoryCard {...{play, key}}/>)}
    </HistoryGrid>
    <Note>Last Update: {lastUpdate || 'never'}</Note>
  </div>
}