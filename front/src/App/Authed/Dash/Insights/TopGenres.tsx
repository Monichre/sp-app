import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps, Switch, Route } from 'react-router';
import moment from 'moment'
import { useDashStats, DashStatsTopGenres, DashStats_Week, DashStats_Month, DashStats_Life } from '../../../../types';
import { Loading } from '../../../../comp/Loading';
import { DashStatsDashStats } from '../../../../types';
import { statSync } from 'fs';
import { VictoryPie, VictoryTheme } from 'victory';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid, Label } from 'recharts';

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

const statToHours = ({name, playDurationMs}: Genre) => ({
  name,
  playDurationMs: playDurationMs / (1000 * 60 * 60)
})

const GenreChart: React.SFC<{stats: Genre[]}> = ({stats}) =>
  <ResponsiveContainer width='100%' height={500}>
    <BarChart layout='vertical' data={stats}>
      <CartesianGrid stroke='#999'/>
      <XAxis height={40} type='number' stroke='#ccc' orientation='top'>
        <Label position='insideTopLeft' offset={0} stroke='#ccc'>hours</Label>
      </XAxis>
      <YAxis width={100} dataKey='name' type='category' stroke='#64d6ee'/>
      {/* <Tooltip /> */}
      {/* <Legend /> */}
      <Bar dataKey='playDurationMs' fill='#64d6ee'/>
    </BarChart>
  </ResponsiveContainer>


export const TopGenres: React.SFC<{global: Genre[], user: Genre[]}> = ({global, user}) => {
  const spt = global.reduce((a,x) => a + x.playDurationMs, 0)
  const sp = global.map((s, x) => ({label: `${s.name}`, x, y: s.playDurationMs / spt}))
  const ut = user.reduce((a,x) => a + x.playDurationMs, 0)
  const u = user.map((s, x) => ({label: s.name, x, y: s.playDurationMs / ut}))

  return (
  <TwoColumns>
    <div data-test='top-genres-global'>
      <Title>Soundpruf Genres</Title>
      <GenreChart stats={global.map(statToHours)}/>
    </div>
    <div data-test='top-genres-personal'>
      <Title>Your Genres</Title>
      <GenreChart stats={user.map(statToHours)}/>
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