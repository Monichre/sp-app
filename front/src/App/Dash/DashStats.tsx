import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { useDashStats } from '../../types';
import { Loading } from '../../comp/Loading';
import { TopGenrePeriods } from './TopGenres';
import { TopArtistPeriods } from './TopArtists';

// we should probably be applying this at a higher level in the DOM
const Container = styled.div`
  padding: 0 0.5rem;
`
const Block = styled.div`
  padding: 0.5rem;
  margin: 0.5rem 0;
`

const NavSelect = styled.select`
  width: 100%;
  color: #FFF !important;
  background-color: #666;
`

export const DashStats: React.SFC<RouteComponentProps & {uid: string}> = ({uid, history}) => {
  const navTo = (path: string) => history.push(path)
  const { data } = useDashStats({variables: {uid}, suspend: true})
  if (!data || !data.dashStats) { return <Loading/>}
  const { dashStats } = data
  console.log('dashStats', dashStats)
  return (
    <Container>
      <Block>
        <NavSelect data-test='top-artists-period-select' onChange={e => navTo(e.target.value)}>
          <option value='/'>This Week</option>
          <option value='/by-month'>This Month</option>
          <option value='/life' data-test='top-artists-period-select-life'>Lifetime</option>
        </NavSelect>
      </Block>
      <TopArtistPeriods stats={dashStats.topArtists}/>
      <TopGenrePeriods stats={dashStats.topGenres}/>
    </Container>
  )
}
