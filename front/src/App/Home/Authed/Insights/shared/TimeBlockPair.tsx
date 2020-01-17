import React, { Fragment } from 'react';
import styled from 'styled-components'
import { NotLarge, Large, BRAND_COLOR, BRAND_GLOBAL_COLOR_BACKGROUND, BRAND_PERSONAL_COLOR_BACKGROUND, BRAND_PERSONAL_COLOR, BRAND_GLOBAL_COLOR, BRAND_GLOBAL_COLOR_BACKGROUND_INACTIVE, BRAND_PERSONAL_COLOR_BACKGROUND_INACTIVE, largeQuery, notLargeQuery, largeNotXLargeQuery, xLargeQuery } from '../../../../../shared/media';
import { NavLink } from 'react-router-dom';
import { insightLink, TPathParams } from './functions';
import { InsightsStatsInsightsStats, InsightsStatsToday, InsightsStatsThisWeek, InsightsStatsThisMonth, InsightsStatsLifetime, InsightsStatsPersonal, InsightsStatsGroup, InsightsStatsDelta } from '../../../../../types';

import { Ascend, Descend } from 'grommet-icons';
import { LineChart, History, User } from 'grommet-icons'
import { Music } from '../../../../../shared/icons';

const MajorValue = styled.div`
  font-weight: 500;
  text-align: center;
  margin-top: 0.65rem;
  ${xLargeQuery`
    font-size: 2.5rem;
  `}
  ${largeNotXLargeQuery`
    font-size: 1.75rem;
  `}
  ${notLargeQuery`
    font-size: 2.5rem;
  `}
`

const NavTabLink = styled(NavLink)`
  display: block;
  text-decoration: none;
  flex: 1;
  padding: 1rem 2rem;
  &.active {
    color: ${BRAND_COLOR}
  }
`


type InsightsStats = InsightsStatsPersonal | InsightsStatsGroup
type InsightsStatsTimescope = InsightsStatsToday | InsightsStatsThisWeek | InsightsStatsThisMonth | InsightsStatsLifetime


type TimeBlockColors = {
  active: {
    color: string
    backgroundColor: string
    value: {
      color: string;
    }
  }
  inactive: {
    color: string
    backgroundColor: string
    value: {
      color: string;
    }
  }
}

type TimeBlockDefs = {
  personal: TimeBlockColors
  group: TimeBlockColors
}
const COLORS: TimeBlockDefs = {
  personal: {
    active: {
      color: BRAND_PERSONAL_COLOR,
      backgroundColor: '#64d6ee',
      value: {
        color: 'white'
      }
    },
    inactive: {
      color: BRAND_PERSONAL_COLOR,
      backgroundColor: BRAND_PERSONAL_COLOR_BACKGROUND_INACTIVE,
      value: {
        color: '#000'
      }
    }
  },
  group: {
    active: {
      color: BRAND_GLOBAL_COLOR,
      backgroundColor: BRAND_GLOBAL_COLOR_BACKGROUND,
      value: {
        color: 'white'
      }
    },
    inactive: {
      color: BRAND_GLOBAL_COLOR,
      backgroundColor: BRAND_GLOBAL_COLOR_BACKGROUND_INACTIVE,
      value: {
        color: '#000'
      }
    }
  }
}

const MinorValue = styled.div`
`
const TimeBlockDeltaView = styled.span`
  margin-left: 10px;

  img {
    height: 15px;
    width: 15px;
    margin-left: 10px;
  }
`
const TimeBlockDelta: React.SFC<{ delta: InsightsStatsDelta }> = ({ delta: { hrs, mins, direction } }) =>
  <TimeBlockDeltaView>
    {mins ? `${hrs}:${mins.toString().padStart(2, '0')}` : hrs}
    {direction == 'up' ? <img src='/icons/trending-up.svg' /> : <img src='/icons/trending-down.svg' />}
  </TimeBlockDeltaView>



const TimeBlockLink = styled(({ colors, ...rest }) => <NavLink {...rest} />) <{ colors: TimeBlockColors }>`
  ${xLargeQuery`
  height: 6.5rem;
  `}
  ${largeNotXLargeQuery`
  height: 6rem;
  `}
  ${notLargeQuery`
  height: 6.5rem;
  `}
  padding: 1rem 0.5rem;
  text-decoration: none;
  background-color: ${({ colors }) => colors.inactive.backgroundColor};
  color: ${({ colors }) => colors.inactive.color};
  ${MajorValue} {
    color: ${({ colors }) => colors.inactive.value.color};
    opacity: 0.3;
  }
  ${TimeBlockDeltaView} {
    color: ${({ colors }) => colors.inactive.value.color};
    opacity: 0.3;
  }
  &.active {
    background-color: ${({ colors }) => colors.active.backgroundColor};
    border-top: 0.5rem solid ${({ colors }) => colors.active.color};
    color: white;
    padding-top: 0;
    padding-top: 0.5rem;
    ${MajorValue} {
      color: ${({ colors }) => colors.active.value.color};
      // opacity: 1.0;
    }
    ${TimeBlockDeltaView} {
      color: #FFF;
      opacity: 0.5;
      path {
        stroke: #FFF;
      }
    }
  }
`

const TimeBlock: React.SFC<{ stats: InsightsStats, colors: TimeBlockColors, pathParams: TPathParams }> = ({ stats: { current: { hrs, mins }, delta }, colors, pathParams }) =>
  <TimeBlockLink {...{ colors, to: insightLink(pathParams) }}>
    <MajorValue>
      {mins ? `${hrs}h ${mins.toString().padStart(2, '0')}m` : `${hrs}h`}
    </MajorValue>
  </TimeBlockLink>


const TimeBlockPairView = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  & > * {
    flex: 1;
  }
`

const TimeBlockHeaderWrap = styled.div`
  width: 50%;

  height: max-content;

  h4 {

    margin: 0;
    width: max-content;
    background: #030616;
    font-family: 'Source Sans Pro';
    letter-spacing: 5px;
    text-transform: uppercase;
    color: #fff;
    font-weight: bolder;
    padding: 0 10px 10px;
  }

`

const TimeBlockTitleRow = styled.div`
  display: flex;
  width: 100%;
  height: max-content;
  margin: 0;
  align-content: center;
  align-items: center;
  z-index: 0;
  top: 0;
  left: 0;
  position: absolute;

  ${TimeBlockHeaderWrap} {

  }
`




/*
    h4 {
    position: relative;
    width: 50%;
    font-family: 'Source Sans Pro';
    text-align: center;
    opacity: .5;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: #fff;
    font-weight: bolder;
  }

*/

const MusicWrap: any = styled.span`
  margin-right: 10px;
`

export const TimeBlockPair: React.SFC<{ label?: string, pathParams: TPathParams, stats: InsightsStatsTimescope }> = ({ label, pathParams, stats }) => {
  const { personal, group } = stats
  const { delta } = personal
  console.log('TCL: delta', delta)

  return (
    <Fragment>
      {label ?
        <NavTabLink to={insightLink(pathParams)}>
          <MusicWrap>
            <Music />
          </MusicWrap>
          {label}: {delta ? <TimeBlockDelta {...{ delta }} /> : ''}
        </NavTabLink>
        : delta ? <TimeBlockDelta {...{ delta }} /> : ''
      }

      <TimeBlockPairView>
        <TimeBlockTitleRow>
          <TimeBlockHeaderWrap><h4>You</h4></TimeBlockHeaderWrap>
          <TimeBlockHeaderWrap>
            <h4>Everyone</h4>
          </TimeBlockHeaderWrap>
        </TimeBlockTitleRow>
        <TimeBlock stats={personal} colors={COLORS.personal} pathParams={Object.assign({}, pathParams, { perspective: 'personal' })} />

        <TimeBlock stats={group} colors={COLORS.group} pathParams={Object.assign({}, pathParams, { perspective: 'group' })} />

      </TimeBlockPairView>
    </Fragment>
  )
}


