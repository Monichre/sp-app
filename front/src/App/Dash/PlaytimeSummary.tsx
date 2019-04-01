import React from 'react';
import styled from 'styled-components'
import moment from 'moment'
import { usePlaytimeSummary } from '../../types';

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


const TimeStatBlock: React.SFC<{label: string, value: number}> = ({label, value}) =>
  <StatBlock>{value} <label>{label}</label></StatBlock>

const TimeBlock: React.SFC<{title: string, duration: number}> = ({title, duration}) => {
  const m = moment.duration(duration)
  const hrs = m.hours()
  const mins = m.minutes()
  const secs = m.seconds()

  return (
    <OutlineBlock>
      <BlockTitle>{title}</BlockTitle>
      <TimeStatBlock label='hrs' value={hrs}/>
      <TimeStatBlock label='mins' value={mins}/>
      <TimeStatBlock label='seconds' value={secs}/>
    </OutlineBlock>
  )
}

export const PlaytimeSummary: React.SFC<{uid: string}> = ({uid}) => {
  const { data } = usePlaytimeSummary({variables: { uid }, pollInterval: 10000})
  console.log('data', data)

  const todayMs = data && data.playtimeSummary && data.playtimeSummary.today || 0
  const thisMonthMs = data && data.playtimeSummary && data.playtimeSummary.thisMonth || 0
  return (
    <SummaryBlock>
      <TimeBlock title='Today' duration={todayMs}/>
      <TimeBlock title='This Month' duration={thisMonthMs}/>
    </SummaryBlock>
  )
}