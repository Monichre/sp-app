import React from 'react';
import styled from 'styled-components'
import { NotLarge, Large, BRAND_COLOR, BRAND_GLOBAL_COLOR_BACKGROUND, BRAND_PERSONAL_COLOR_BACKGROUND, BRAND_PERSONAL_COLOR, BRAND_GLOBAL_COLOR, BRAND_GLOBAL_COLOR_BACKGROUND_INACTIVE, BRAND_PERSONAL_COLOR_BACKGROUND_INACTIVE, TITLE_FONT } from '../../../../../shared/media';
import { NavLink } from 'react-router-dom';
import { History } from 'history';
import { insightLink, TPathParams } from './functions';
import { InsightsStatsInsightsStats, InsightsStatsToday, InsightsStatsThisWeek, InsightsStatsThisMonth, InsightsStatsLifetime, InsightsStatsPersonal, InsightsStatsGroup, InsightsArtistStatsInsightsArtistStats, InsightsGenreStatsInsightsGenreStats } from '../../../../../types';
import { VerticalSpacer } from '../../../../../shared/VerticalSpacer';
import { TimeBlockPair } from './TimeBlockPair';
import { Container } from '../../../../../shared/ui';


type InsightsStatsTimescope = InsightsStatsToday | InsightsStatsThisWeek | InsightsStatsThisMonth | InsightsStatsLifetime


const NavSelect = styled.select`
  // font-family: ${TITLE_FONT}

  z-index: 20;
  position: fixed;
  top: 0;
  right: 0;
  cursor: pointer;
  width: 100%;
  display: block;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  color: #FFF !important;
  background-color: #555;
  font-size: 1.25rem;
  border: none;
  padding: 1rem;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
	background-repeat: no-repeat, repeat;
	background-position: right .7em top 50%, 0 0;
	background-size: .65em auto, 100%;
`

const NavOption: React.SFC<{pathParams: TPathParams, label: string}> = ({pathParams, label}) =>
  <option value={insightLink(pathParams)}>{label}</option>
  // <option selected={pathname.includes(insightLink(pathParams))} value={insightLink(pathParams)}>{label}</option>

  type TNavOption = {
    label: string
    addParams: { timeScope: TTimeScopeOption }
  }
const navOptions: TNavOption[]  = [
  // { label: 'Today', addParams: {timeScope: 'today'} },
  { label: 'This Week', addParams: {timeScope: 'thisWeek'} },
  { label: 'This Month', addParams: {timeScope: 'thisMonth'} },
  { label: 'Lifetime', addParams: {timeScope: 'lifetime'} },
]

const NavTabLink = styled(NavLink)`
  display: block;
  text-decoration: none;
  flex: 1;
  padding: 1rem 2rem;
  &.active {
    color: ${BRAND_COLOR}
  }
`



const NavTabView = styled.div`
display: block;
flex: 1;
margin-right: 0.75rem;
`

const NavTab: React.SFC<{label: string, pathParams: TPathParams, stats: InsightsStatsTimescope}> = ({label, pathParams, stats}) =>
  <NavTabView>
    <NavTabLink to={insightLink(pathParams)}>{label}</NavTabLink>
    <TimeBlockPair {...{pathParams, stats}}/>
  </NavTabView>

const NavTabsView = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 1rem;
`
const NavTabs: React.SFC<{pathParams: TPathParams, stats: Stats}> = ({pathParams, stats}) =>
  <NavTabsView>
    { navOptions.map( ({label, addParams}, key) => <NavTab {...{key, label, stats: stats[addParams.timeScope], pathParams: Object.assign({}, pathParams, addParams)}}/> )}
  </NavTabsView>

type TTimeScopeOption = 'today' | 'thisWeek' | 'thisMonth' | 'lifetime'

export type TDashStats = {
  today: TTimeScopeStats
  thisWeek: TTimeScopeStats
  thisMonth: TTimeScopeStats
  lifetime: TTimeScopeStats
}
type TTimeScopeStats = {
  personal: TPerspectiveStats
  group: TPerspectiveStats
}
type TPerspectiveStats = {
  current: {
    hrs: number
    mins?: number
  }
  delta?: {
    direction: 'up' | 'down'
    hrs: number
    mins?: number
  }
}

export type Stats = InsightsStatsInsightsStats | InsightsArtistStatsInsightsArtistStats | InsightsGenreStatsInsightsGenreStats
export const StatPage: React.SFC<{stats: Stats, path: string, pathParams: TPathParams, history: History}> =
({stats, history, path, pathParams, children }) => {
  const navTo = (path: string) => history.push(path)
  return (
    <>
      <Large>
        <NavTabs {...{pathParams, stats}}/>
      </Large>
      <NotLarge>
        <NavSelect data-test='top-artists-period-select' onChange={e => navTo(e.target.value)} defaultValue={insightLink(pathParams)}>
          { navOptions.map(({label, addParams}, key) => <NavOption {...{key, label, pathParams: Object.assign({}, pathParams, addParams)}}/>) }
        </NavSelect>
        <VerticalSpacer height='55px'/>
        <TimeBlockPair {...{pathParams, stats: stats[pathParams.timeScope]}}/>
      </NotLarge>
      <Container>
        {children}
        <VerticalSpacer height='110px'/>
      </Container>
    </>
  )
}
