import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps, Switch, Route } from 'react-router';
import moment from 'moment'
import { useDashStats, DashStatsTopGenres, DashStats_Week, DashStats_Month, DashStats_Life } from '../../types';
import { Loading } from '../../comp/Loading';
import { DashStatsDashStats } from '../../types';
import { statSync } from 'fs';
import { VictoryPie, VictoryTheme } from 'victory';

const Block = styled.div`
  // padding: 0.5rem;
  // margin: 0.5rem 0;
  margin-top: 1rem;
`

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 2rem;
  @media (max-width: 600px) {
    grid-template-columns: 100%;
  }

  align-items: start;
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

const Title = styled.div`
  text-transform: uppercase;
  font-weight: 500;
  font-size: 1.2rem;
  padding-bottom: 10px;
  margin-bottom: 1rem;
  border-bottom: 1px solid #64d6ee;
`



export const TopGenres: React.SFC<{global: Genre[], user: Genre[]}> = ({global, user}) => {
  const spt = global.reduce((a,x) => a + x.playDurationMs, 0)
  const sp = global.map((s, x) => ({label: `${s.name}`, x, y: s.playDurationMs / spt}))
  const ut = user.reduce((a,x) => a + x.playDurationMs, 0)
  const u = user.map((s, x) => ({label: s.name, x, y: s.playDurationMs / ut}))
  // const data = [
  //   {label: 'foo', x:1, y: 100},
  //   {label: 'bar', x:2, y: 50}
  // ]
  return (
  <TwoColumns>
    <div data-test='top-genres-global'>
      <Title>Soundpruf Genres</Title>
      <VictoryPie data={sp} theme={VictoryTheme.material}/>
      {/* { global.map((artist, key) => <GenreRow {...{key, artist}}/>)} */}
    </div>
    <div data-test='top-genres-personal'>
      <Title>Your Genres</Title>
      <VictoryPie data={u} theme={VictoryTheme.material}/>
      {/* { user.map((artist, key) => <GenreRow {...{key, artist}}/>)} */}
    </div>
  </TwoColumns>
  )
}

type DashStatsGenrePeriod = DashStats_Week | DashStats_Month | DashStats_Life;

export const TopGenrePeriods: React.SFC<{stats: DashStatsGenrePeriod}> = ({stats}) => {
  return (
    <Block>
    <TopGenres global={stats.global} user={stats.user}/>
    </Block>
  )
}