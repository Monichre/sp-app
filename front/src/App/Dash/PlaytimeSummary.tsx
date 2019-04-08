import React from 'react';
import styled, { keyframes } from 'styled-components'
import moment from 'moment'
import { usePlaytimeSummary } from '../../types';
import { Loading } from '../../comp/Loading';
import { Ascend, Descend, Info, History } from 'grommet-icons'
import { Music } from '../../comp/icons';
import { NavLink } from 'react-router-dom';

const EvenRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  & > * {
    flex: 1
  }
`
const SummaryGrid = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 0 2rem;
  display: grid
  align-items: end;
  grid-column-gap: 0.5rem;
  grid-row-gap: 0.5rem;
  grid-template:
  [row1-start] "welcome thisWeek thisWeek" [row1-end]
  [row2-start] "today thisMonth nav" [row2-start]
  / 50% 35% 15%
@media (max-width: 800px) {
    grid-template:
    "welcome"
    "today"
    "thisWeek"
    "thisMonth"
    "nav"
    / 100%
  }
`

const Block = styled.div`
  padding: 1rem;
  margin: 0rem;
  & > * {
    margin-bottom: 1rem;
  }
`

const BackgroundBlock = styled(Block)`
  background-color: rgba(0, 6, 8, 0.5);
  border-radius: 0.5rem;
`

const BlockTitle = styled.div`
  text-transform: uppercase;
  font-weight: 500;
  font-size: 1.2rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #64d6ee;
`

const StatBlock = styled.span`
  font-weight: 300;
  font-size: 1.5rem;
  label {
    font-weight: bold;
    opacity: 0.4;
    font-size: 0.8rem;
    text-transform: uppercase;
  }
`

const LeftRow = styled.div`
  display: flex;
  align-items: baseline;
  & > * {
    margin-right: 0.5rem;
  }
`

const MajorValue = styled.div`
  font-weight: 500;
  font-size: 40px;
`

const MinorValue = styled.div`
font-size: 30px;
font-weight: 500;
color: #64d6ee;
`

const Note = styled.div`
  margin-top: 0.5rem;
  color: #AAA !important;
  font-size: 1.0rem;
  font-weight: light;
`

const TimeStatBlock: React.SFC<{label: string, value: number}> = ({label, value}) =>
  <StatBlock>{value} <label>{label}</label></StatBlock>

type Durations = {
  current: number
  prev: number
}

const hrsAndMinsAndSecs = (durationMs: number) => {
  const d = moment.duration(durationMs)
  return {
    hrs: Math.abs(Math.trunc(d.asHours())),
    mins: Math.abs(d.minutes()),
    secs: Math.abs(d.seconds()),
  }
}

const TimeBlock: React.SFC<{title: string, durations: Durations, label: string, className?: string}> =
  ({title, durations: { current, prev }, label, className}) => {
  // const m = moment.duration(current)
  const { hrs, mins } = hrsAndMinsAndSecs(current)
  // const hrs = m.hours()
  // const mins = m.minutes()
  // const secs = m.seconds()
  const increase = (current - prev) > 0
  // const dm = moment.duration(current - prev)
  const { hrs: dhrs, mins: dmins } = hrsAndMinsAndSecs(current - prev)
  // const dhrs = Math.abs(dm.hours())
  // const dmins = Math.abs(dm.minutes())

  return (
    <BackgroundBlock {...{className}}>
      <LeftRow>
        <MajorValue>{hrs} hrs</MajorValue>
        <MinorValue>{mins} mins</MinorValue>
  { current > prev ? <Ascend color='white'/> : <Descend color='white'/> }
      </LeftRow>
      <Note>{increase ? 'Up' : 'Down'} {dhrs} hrs, {dmins} mins from {label}</Note>
      <BlockTitle><Music/> {title}</BlockTitle>
    </BackgroundBlock>
  )
}

const HeroBlock = styled(Block)`
  font-size: 34px;
  line-height: 40px;
  font-weight: 600;
  // padding: 0 0 1rem 0;
`


const NavButton = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.7rem;
  text-decoration: none;
  &.active {
    background-color: #555;
  }
  padding-top: 1rem;
  & > * {
    margin-bottom: 1rem;
  }
`

const NavBlock: React.SFC<{className?: string}> = ({className}) =>
  <EvenRow {...{className}}>
    <NavButton data-test='link-insights' to='/insights'>
      <Info color='white'/>
      <div>Insights</div>
    </NavButton>
    <NavButton data-test='link-history' to='/history'>
      <History color='white'/>
      <div>History</div>
    </NavButton>
  </EvenRow>

const WelcomeBlock: React.SFC<{displayName: string | null, className?: string}> = ({displayName, className}) => {
  const greet = displayName ? <span>Welcome, <span data-test="displayName">{displayName}</span>.</span> : "Welcome."
  return (
    <HeroBlock {...{className}}>
      { greet } Here's what you're listening to.
    </HeroBlock>
  )
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const WelcomeGridArea = styled(WelcomeBlock)`grid-area:welcome; align-self: end;`
const TodayGridArea = styled(TimeBlock)`grid-area: today; animation: ${fadeIn} 1s`
const ThisWeekGridArea = styled(TimeBlock)`grid-area: thisWeek; animation: ${fadeIn} 1.5s`
const ThisMonthGridArea = styled(TimeBlock)`grid-area: thisMonth; animation: ${fadeIn} 2s`
const NavGridArea = styled(NavBlock)`grid-area: nav; align-self: start`

export const PlaytimeSummary: React.SFC<{uid: string, displayName: string | null}> = ({uid, displayName}) => {
  const { data } = usePlaytimeSummary({variables: { uid }, pollInterval: 10000, suspend: true})
  console.log('data', data)

  if (!data || !data.playtimeSummary) { return <Loading/> } // due to suspense this should never happen, but i want to type-safe the thing
  const { playtimeSummary: { day, week, month }} = data
  return (
    <SummaryGrid>
      <WelcomeGridArea {...{displayName}}/>
      <TodayGridArea title='Today' durations={day} label='yesterday'/>
      <ThisWeekGridArea title='This Week' durations={week} label='last week'/>
      <ThisMonthGridArea title='This Month' durations={month} label='last month'/>
      <NavGridArea/>
    </SummaryGrid>
  )
}