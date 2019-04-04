import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps, Switch, Route } from 'react-router';
import { DashStatsDashStats, DashStatsTopArtists } from '../../types';
import moment from 'moment'

const EvenRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  & > * {
    flex: 1
  }
`

const Block = styled.div`
padding: 0.5rem;
margin: 0.5rem 0;
`

const hrsAndMins = (durationMs: number) => {
  const d = moment.duration(durationMs)
  return {
    hrs: Math.trunc(d.asHours()),
    mins: d.minutes(),
  }
}

type Artist = {
  name: string
  playDurationMs: number
}

const ArtistRow: React.SFC<{artist: Artist}> = ({artist: {name, playDurationMs}}) => {
  const { hrs, mins } = hrsAndMins(playDurationMs)
  return (<div data-test='artist-row'>
    <h5 data-test='artist-row-name'>{name}</h5>
    <p>
      <span data-test='artist-row-hours'>{hrs}</span> hrs
      &nbsp;<span data-test='artist-row-minutes'>{mins}</span> mins
    </p>
  </div>
)}

const TopArtists: React.SFC<{global: Artist[], user: Artist[]}> = ({global, user}) => (
  <EvenRow>
    <div data-test='top-artists-global'>
      <h3>On Soundpruf</h3>
      { global.map((artist, key) => <ArtistRow {...{key, artist}}/>)}
    </div>
    <div data-test='top-artists-personal'>
      <h3>Your Top</h3>
      { user.map((artist, key) => <ArtistRow {...{key, artist}}/>)}
    </div>
  </EvenRow>
)

export const TopArtistPeriods: React.SFC<{stats: DashStatsTopArtists}> = ({stats}) => {
  return (
    <Block>
    <h2>Top Artists</h2>

    <Switch>
      <Route path='/life' render={(props) => <TopArtists global={stats.life.global} user={stats.life.user}/>}/>
      <Route path='/by-month' render={(props) => <TopArtists global={stats.month.global} user={stats.month.user}/>}/>
      <Route path='/' render={(props) => <TopArtists global={stats.week.global} user={stats.week.user}/>}/>
    </Switch>
    </Block>
  )
}