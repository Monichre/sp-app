import React from 'react';
import styled from 'styled-components'
import { NotLarge, Large, BRAND_COLOR, BRAND_GLOBAL_COLOR_BACKGROUND, BRAND_PERSONAL_COLOR_BACKGROUND, BRAND_PERSONAL_COLOR, BRAND_GLOBAL_COLOR, BRAND_GLOBAL_COLOR_BACKGROUND_INACTIVE, BRAND_PERSONAL_COLOR_BACKGROUND_INACTIVE, largeQuery, notLargeQuery, largeNotXLargeQuery, xLargeQuery } from '../../../../../shared/media';
import { NavLink } from 'react-router-dom';
import { insightLink, TPathParams } from './functions';
import { InsightsStatsInsightsStats, InsightsStatsToday, InsightsStatsThisWeek, InsightsStatsThisMonth, InsightsStatsLifetime, InsightsStatsPersonal, InsightsStatsGroup, InsightsStatsDelta } from '../../../../../types';
import { Ascend, Descend } from 'grommet-icons';

const MajorValue = styled.div`
  font-weight: 500;
  text-align: center;
  margin-bottom: 0.25rem;
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

// const MinorValue = styled.div`
// font-size: 30px;
// font-weight: 500;
// color: #64d6ee;
// `


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
      backgroundColor: BRAND_PERSONAL_COLOR_BACKGROUND,
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
const TimeBlockDeltaView = styled.div`
  text-align: center;
`
const TimeBlockDelta: React.SFC<{delta: InsightsStatsDelta}> = ({delta: { hrs, mins, direction }}) =>
  <TimeBlockDeltaView>
    { direction == 'up' ? <Ascend color={direction == 'up' ? 'white' : 'black'}/> : <Descend color={direction == 'up' ? 'white' : 'black'}/> }
    {/* {direction} */}
    {mins ? `${hrs}:${mins.toString().padStart(2, '0')}` : hrs}
  </TimeBlockDeltaView>



const TimeBlockLink = styled(({colors, ...rest}) => <NavLink {...rest}/>)<{colors: TimeBlockColors}>`
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
  background-color: ${({colors}) => colors.inactive.backgroundColor};
  color: ${({colors}) => colors.inactive.color};
  ${MajorValue} {
    color: ${({colors}) => colors.inactive.value.color};
    opacity: 0.3;
  }
  ${TimeBlockDeltaView} {
    color: ${({colors}) => colors.inactive.value.color};
    opacity: 0.3;
  }
  &.active {
    background-color: ${({colors}) => colors.active.backgroundColor};
    border-top: 0.5rem solid ${({colors}) => colors.active.color};
    color: white;
    padding-top: 0;
    padding-top: 0.5rem;
    ${MajorValue} {
      color: ${({colors}) => colors.active.value.color};
      opacity: 1.0;
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


const TimeBlock: React.SFC<{stats: InsightsStats, colors: TimeBlockColors, pathParams: TPathParams}> = ({stats: { current: { hrs, mins }, delta }, colors, pathParams}) =>
    <TimeBlockLink {...{colors, to: insightLink(pathParams)}}>
      <MajorValue>
        {mins ? `${hrs}:${mins.toString().padStart(2, '0')}` : hrs}
      </MajorValue>
      { delta ? <TimeBlockDelta {...{delta}}/> : '' }
    </TimeBlockLink>

const TimeBlockPairView = styled.div`
  display: flex;
  flex-direction: row;
  & > * {
    flex: 1;
  }
`

export const TimeBlockPair: React.SFC<{pathParams: TPathParams, stats: InsightsStatsTimescope}> = ({pathParams, stats: { personal, group }}) =>
  <TimeBlockPairView>
    <TimeBlock stats={personal} colors={COLORS.personal} pathParams={Object.assign({}, pathParams, {perspective: 'personal'})}/>
    <TimeBlock stats={group} colors={COLORS.group} pathParams={Object.assign({}, pathParams, {perspective: 'group'})}/>
  </TimeBlockPairView>

