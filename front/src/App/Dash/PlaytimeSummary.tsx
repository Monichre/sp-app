import React from 'react';
import styled from 'styled-components'
import moment from 'moment'
import { usePlaytimeSummary } from '../../types';
import { Loading } from '../../comp/Loading';

const EvenRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  & > * {
    flex: 1
  }
`
const SummaryBlock = styled(EvenRow)`
  // margin: 0.5rem;
  // padding: 0.5rem;
  // border: 1px solid #666;
`

const OutlineBlock = styled.div`
  border: 1px solid #AAA;
  margin: 0.5rem;
  padding: 0.5rem;
`

const BlockTitle = styled.h4`
  margin: 0;
  padding: 0;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-size: 0.8rem;
  opacity: 0.6;
`

const StatBlock = styled.div`
  font-weight: 300;
  font-size: 1.5rem;
  label {
    font-weight: bold;
    opacity: 0.4;
    font-size: 0.8rem;
    text-transform: uppercase;
  }
`

const Note = styled.div`
  margin-top: 0.5rem;
  color: #888 !important;
  font-size: 0.8rem;
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

const TimeBlock: React.SFC<{title: string, durations: Durations, label: string}> = ({title, durations: { current, prev }, label}) => {
  // const m = moment.duration(current)
  const { hrs, mins, secs } = hrsAndMinsAndSecs(current)
  // const hrs = m.hours()
  // const mins = m.minutes()
  // const secs = m.seconds()
  const increase = (current - prev) > 0
  // const dm = moment.duration(current - prev)
  const { hrs: dhrs, mins: dmins } = hrsAndMinsAndSecs(current - prev)
  // const dhrs = Math.abs(dm.hours())
  // const dmins = Math.abs(dm.minutes())

  return (
    <OutlineBlock>
      <BlockTitle>{title}</BlockTitle>
      <TimeStatBlock label='hrs' value={hrs}/>
      <TimeStatBlock label='mins' value={mins}/>
      <TimeStatBlock label='seconds' value={secs}/>
      <Note>{increase ? 'Up' : 'Down'} {dhrs} hrs, {dmins} mins from {label}</Note>
    </OutlineBlock>
  )
}

export const PlaytimeSummary: React.SFC<{uid: string}> = ({uid}) => {
  const { data } = usePlaytimeSummary({variables: { uid }, pollInterval: 10000, suspend: true})
  console.log('data', data)

  if (!data || !data.playtimeSummary) { return <Loading/> } // due to suspense this should never happen, but i want to type-safe the thing
  const { playtimeSummary: { day, week, month }} = data
  return (
    <SummaryBlock>
      <TimeBlock title='Today' durations={day} label='yesterday'/>
      <TimeBlock title='Week' durations={week} label='last week'/>
      <TimeBlock title='Month' durations={month} label='last month'/>
    </SummaryBlock>
  )
}