import React from 'react';
import styled, { keyframes } from 'styled-components'
import { usePlaytimeSummary } from '../../../../../types';
import { Loading } from '../../../../../shared/Loading';
import { WelcomeBlock } from './WelcomeBlock';
import { TimeBlock } from './TimeBlock';
import { TopArtistBlock } from './TopArtistBlock';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const SummaryGrid = styled.div`
  margin-bottom: 1rem;
  display: grid
  align-items: end;
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.5rem;
  grid-template:
  [row1-start] "welcome today today" [row1-end]
  [row2-start] "topArtist thisWeek thisMonth" [row2-start]
  / 2fr 1.5fr 1.5fr
  @media (max-width: 1050px) {
    grid-template:
    "welcome welcome"
    "today today"
    "thisWeek thisMonth"
    "topArtist topArtist"
    / 1fr 1fr
  }
  @media (max-width: 660px) {
    grid-template:
    "welcome"
    "today"
    "thisWeek"
    "thisMonth"
    "topArtist"
    / 1fr
  }
`

const WelcomeGridArea = styled(WelcomeBlock)`grid-area:welcome; align-self: end;`
const TodayGridArea = styled(TimeBlock)`grid-area: today; animation: ${fadeIn} 1s`
const ThisWeekGridArea = styled(TimeBlock)`grid-area: thisWeek; animation: ${fadeIn} 1.5s`
const ThisMonthGridArea = styled(TimeBlock)`grid-area: thisMonth; animation: ${fadeIn} 2s`
const TopArtistGridArea = styled(TopArtistBlock)`grid-area: topArtist; animation: ${fadeIn} 3s`

export const DashSummary: React.SFC<{uid: string, displayName: string | null}> = ({uid, displayName}) => {
  const { data } = usePlaytimeSummary({variables: { uid }, pollInterval: 10000, suspend: true})
  console.log('data', data)

  if (!data || !data.playtimeSummary) { return <Loading/> } // due to suspense this should never happen, but i want to type-safe the thing
  const { playtimeSummary: { topLifetimeArtists, day, week, month }} = data
  const stat = topLifetimeArtists[0]
  return (
    <SummaryGrid>
      <WelcomeGridArea {...{displayName}}/>
      <TodayGridArea title='Today' durations={day} label='yesterday'/>
      <ThisWeekGridArea title='This Week' durations={week} label='last week'/>
      <ThisMonthGridArea title='This Month' durations={month} label='last month'/>
      {stat ? <TopArtistGridArea {...{stat}}/> : '' }
    </SummaryGrid>
  )
}