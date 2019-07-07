import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { useDashStats } from '../../../../../types';
import { Loading } from '../../../../../shared/Loading';
import { TopGenres } from './TopGenres';
import { TopArtists } from './TopArtists';
import { EmergingArtist } from './EmergingArtist/EmergingArtist';

const Block = styled.div`
  // padding: 0.5rem;
  margin-bottom: 1rem;
`

const NavSelect = styled.select`
  cursor: pointer;
  width: 100%;
  display: block;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  color: #FFF !important;
  /* background-color: #555; */
  font-size: 1.25rem;
  border: none;
  padding: 1rem;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
	background-repeat: no-repeat, repeat;
	background-position: right .7em top 50%, 0 0;
	background-size: .65em auto, 100%;
`

export const Insights: React.SFC<RouteComponentProps<{period: string}> & {uid: string}> = ({uid, history, match}) => {
  const navTo = (path: string) => history.push(path)
  const { data } = useDashStats({variables: {uid}, suspend: true, pollInterval: 6000})
  if (!data || !data.dashStats) { return <Loading/>}
  const { dashStats } = data
  console.log('dashStats', dashStats)
  return (
    <>
      <Block>
        <NavSelect data-test='top-artists-period-select' onChange={e => navTo(e.target.value)}>
          <option value={`/dash/insights/week`}>This Week</option>
          <option value={`/dash/insights/month`}>This Month</option>
          <option value={`/dash/insights/life`} data-test='top-artists-period-select-life'>Lifetime</option>
        </NavSelect>
      </Block>
      <TopArtists stats={dashStats.topArtists[match.params.period as 'week' | 'month' | 'life']}/>
      <TopGenres stats={dashStats.topGenres[match.params.period as 'week' | 'month' | 'life']}/>
      <EmergingArtist/>
    </>
  )
}
