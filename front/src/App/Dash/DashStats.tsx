import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { useDashStats, DashStatsWeek, DashStatsMonth, DashStatsLife } from '../../types';
import { Loading } from '../../comp/Loading';
import { TopGenrePeriods } from './TopGenres';
import { TopArtistPeriods } from './TopArtists';

// we should probably be applying this at a higher level in the DOM
const Container = styled.div`
  padding: 0 0.5rem;
`
const Block = styled.div`
  // padding: 0.5rem;
  margin-bottom: 1rem;
`

const NavSelect = styled.select`
  width: 100%;
  color: #FFF !important;
  background-color: #666;
`

type DashStatsPeriod = DashStatsWeek | DashStatsMonth | DashStatsLife

const ArtistPeriodStats: React.SFC<{stats: DashStatsPeriod}> = ({stats}) =>
  <></>

export const DashStats: React.SFC<RouteComponentProps<{period: string}> & {uid: string}> = ({uid, history, match}) => {
  const navTo = (path: string) => history.push(path)
  const { data } = useDashStats({variables: {uid}, suspend: true})
  if (!data || !data.dashStats) { return <Loading/>}
  const { dashStats } = data
  console.log('dashStats', dashStats)
  return (
    <Container>
      <Block>
        <NavSelect data-test='top-artists-period-select' onChange={e => navTo(e.target.value)}>
          <option value={`/insights/week`}>This Week</option>
          <option value={`/insights/month`}>This Month</option>
          <option value={`/insights/life`} data-test='top-artists-period-select-life'>Lifetime</option>
        </NavSelect>
      </Block>
      <TopArtistPeriods stats={dashStats.topArtists[match.params.period as 'week' | 'month' | 'life']}/>
      <TopGenrePeriods stats={dashStats.topGenres[match.params.period as 'week' | 'month' | 'life']}/>
    </Container>
  )
}
