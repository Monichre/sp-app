import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps, Switch, Route } from 'react-router';
import moment from 'moment'
import { useDashStats, DashStatsTopGenres } from '../../types';
import { Loading } from '../../comp/Loading';
import { DashStatsDashStats } from '../../types';

const Block = styled.div`
  padding: 0.5rem;
  margin: 0.5rem 0;
`

const EvenRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  & > * {
    flex: 1
  }
`

type Genre = {
  name: string
  playDurationMs: number
}

const hrsAndMins = (durationMs: number) => {
  const d = moment.duration(durationMs)
  return {
    hrs: Math.trunc(d.asHours()),
    mins: d.minutes(),
  }
}

const GenreRow: React.SFC<{artist: Genre}> = ({artist: {name, playDurationMs}}) => {
  const { hrs, mins } = hrsAndMins(playDurationMs)
  return (<div data-test='genre-row'>
    <h5 data-test='genre-row-name'>{name}</h5>
    <p>
      <span data-test='genre-row-hours'>{hrs}</span> hrs
      &nbsp;<span data-test='genre-row-minutes'>{mins}</span> mins
    </p>
  </div>
)}

export const TopGenres: React.SFC<{global: Genre[], user: Genre[]}> = ({global, user}) => (
  <EvenRow>
    <div data-test='top-genres-global'>
      <h3>On Soundpruf</h3>
      { global.map((artist, key) => <GenreRow {...{key, artist}}/>)}
    </div>
    <div data-test='top-genres-personal'>
      <h3>Your Top</h3>
      { user.map((artist, key) => <GenreRow {...{key, artist}}/>)}
    </div>
  </EvenRow>
)

export const TopGenrePeriods: React.SFC<{stats: DashStatsTopGenres}> = ({stats}) => {
  return (
    <Block>
    <h2>Top Genres</h2>

    <Switch>
      <Route path='/life' render={(props) => <TopGenres global={stats.life.global} user={stats.life.user}/>}/>
      <Route path='/by-month' render={(props) => <TopGenres global={stats.month.global} user={stats.month.user}/>}/>
      <Route path='/' render={(props) => <TopGenres global={stats.week.global} user={stats.week.user}/>}/>
    </Switch>
    </Block>
  )
}