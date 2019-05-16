import React from 'react';
import styled from 'styled-components'
import { Ascend, Descend } from 'grommet-icons'
import { Music } from '../../../../../shared/icons';
import { hrsAndMinsAndSecs } from '../../../../../lib/durationFormats';

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
  display: flex;
  align-items: flex-end;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 1.2rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #64d6ee;

  & > * {
    margin-right: 0.5rem;
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

type Durations = {
  current: number
  prev: number
}

export const TimeBlock: React.SFC<{title: string, durations: Durations, label: string, className?: string}> =
  ({title, durations: { current, prev }, label, className}) => {
  const { hrs, mins } = hrsAndMinsAndSecs(current)
  const increase = (current - prev) > 0
  const { hrs: dhrs, mins: dmins } = hrsAndMinsAndSecs(current - prev)

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
