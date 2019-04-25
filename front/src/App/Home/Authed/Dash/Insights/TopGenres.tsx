import React from 'react';
import styled from 'styled-components'
import { DashStats_Week, DashStats_Month, DashStats_Life } from '../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label } from 'recharts';

const Block = styled.div`
  margin-top: 1rem;
`

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  align-items: start;
`

type Genre = {
  name: string
  playDurationMs: number
}

const Title = styled.div<{color?: string}>`
  text-transform: uppercase;
  font-weight: 500;
  font-size: 1.2rem;
  padding-bottom: 10px;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({color}) => color || '#64d6ee'};
`

const statToHours = ({name, playDurationMs}: Genre) => ({
  name,
  playDurationMs: playDurationMs / (1000 * 60 * 60)
})

const GenreChart: React.SFC<{stats: Genre[], color: string}> = ({stats, color}) =>
  <ResponsiveContainer width='100%' height={500}>
    <BarChart layout='vertical' data={stats}>
      {/* <CartesianGrid stroke='#999'/> */}
      <XAxis height={40} type='number' stroke='#ccc' orientation='top'>
        <Label position='insideTopLeft' offset={0} stroke='#ccc'>hours</Label>
      </XAxis>
      <YAxis width={100} dataKey='name' type='category' stroke={color}/>
      {/* <Tooltip /> */}
      {/* <Legend /> */}
      <Bar dataKey='playDurationMs' fill={color}/>
    </BarChart>
  </ResponsiveContainer>


export const TopGenresPeriod: React.SFC<{global: Genre[], user: Genre[]}> = ({global, user}) => {
  const spt = global.reduce((a,x) => a + x.playDurationMs, 0)
  const sp = global.map((s, x) => ({label: `${s.name}`, x, y: s.playDurationMs / spt}))
  const ut = user.reduce((a,x) => a + x.playDurationMs, 0)
  const u = user.map((s, x) => ({label: s.name, x, y: s.playDurationMs / ut}))

  return (
  <TwoColumns>
    <div data-test='top-genres-global'>
      <Title color='#67BF72'>Soundpruf Genres</Title>
      <GenreChart color='#67BF72' stats={global.map(statToHours)}/>
    </div>
    <div data-test='top-genres-personal'>
      <Title>Your Genres</Title>
      <GenreChart color='#64d6ee' stats={user.map(statToHours)}/>
    </div>
  </TwoColumns>
  )
}

type DashStatsGenrePeriod = DashStats_Week | DashStats_Month | DashStats_Life;

export const TopGenres: React.SFC<{stats: DashStatsGenrePeriod}> = ({stats}) => {
  return (
    <Block>
    <TopGenresPeriod global={stats.global} user={stats.user}/>
    </Block>
  )
}