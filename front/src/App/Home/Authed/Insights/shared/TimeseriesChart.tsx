import React from 'react';
import { PerspectiveDashArtists, TimescopeDashTimeSeries, useInsightsDash, useInsightsStats, TimescopeDashValues } from '../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Text, LineChart, Line, Area, AreaChart, Tooltip, TooltipProps } from 'recharts';
import { BRAND_GLOBAL_COLOR, BRAND_PERSONAL_COLOR, notLargeQuery, largeQuery } from '../../../../../shared/media';
import styled from 'styled-components';
import { BlockTitle, BlockTitleMore } from '../shared/BlockTitle';
import max from 'ramda/es/max';
import pluck from 'ramda/es/pluck';
import reduce from 'ramda/es/reduce';
import pipe from 'ramda/es/pipe';
import { TPerspectiveOption } from './functions';

const domainMaxBuilder: (values: TimescopeDashValues[], fromSeries?: TPerspectiveOption) => (maxValue: number) => number =
  // (values: TimescopeDashValues[]) => (maxValue: number) => pipe((vals: TimescopeDashValues[]) => vals.map(v => v.group), reduce(max, -Infinity))(values), 
  (values, fromSeries = 'group') => (maxValue) => Math.ceil(pipe<any[], any[], any>(pluck(fromSeries), reduce(max, -Infinity))(values))

  const decimalToHrsMins = (value: number) => `${Math.floor(value)}:${Math.floor((value % 1) * 60).toString().padStart(2, '0')}`

const TooltipDiv = styled.div`
background-color: rgba(216, 216, 216, .05);
min-width: 15rem;
padding: 0.5rem;
`
const TooltipTitle = styled.div`
font-weight: bold;
font-size: 1.1rem;
text-align: center;
padding: 0.5rem 1rem 0.5rem 1rem;
`
const TooltipItem = styled.div`
display: flex;
`
const TooltipLabel = styled.div`
padding: 0 0.5rem 0.5rem 0.5rem;
text-align: right;
flex: 1;
color: ${({color}) => color}
`
const TooltipValue = styled.div`
padding: 0 0.5rem 0.5rem 0.5rem;
text-align: left;
flex: 1;
color: ${({color}) => color}
`

const gradient = `linear-gradient(to bottom,#e64a19 0%,#ffa726 100%)`
/* const gradient = `linear-gradient(to bottom,#e64a19 0%,#ffa726 100%)` */
/* <linearGradient id="Gradient">
      <stop offset="0%" stop-color="#e64a19"/>
      <stop offset="100%" stop-color="#ffa726"/>
    </linearGradient>
    "url(#Gradient2)" */


export const TimeseriesChart: React.SFC<{timeSeries: TimescopeDashTimeSeries, showOnly?: TPerspectiveOption}> = ({timeSeries, showOnly}) => {
  return (

<div>
<BlockTitle>{timeSeries.label}</BlockTitle>
<ResponsiveContainer width='100%' height={240}>
  <AreaChart data={timeSeries.values}>
    <defs>
      <linearGradient id="Gradient">
        <stop offset="0%" stopColor="#e64a19"/>
        <stop offset="100%" stopColor="#ffa726"/>
      </linearGradient>
      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <XAxis dataKey='period' stroke='#ccc' textAnchor='middle' tickMargin={12}>
    </XAxis>

    <YAxis yAxisId='left' type='number' stroke={BRAND_PERSONAL_COLOR} interval={0} orientation='left'
      tickFormatter={decimalToHrsMins} allowDecimals={true} domain={[0, domainMaxBuilder(timeSeries.values, showOnly)]}>
      <Label position='left' angle={90} offset={-8}  y={-32} stroke={BRAND_PERSONAL_COLOR}>hours</Label>
    </YAxis>
   
    {
      !showOnly || (showOnly === 'group') ? <Area dataKey='group' stackId="1" fill="url(#Gradient)" stroke='#fd5f00' yAxisId='left'/> : ''
    }
    {
      !showOnly || (showOnly === 'personal') ? <Area dataKey='personal' stackId="2" fill="url(#Gradient)" stroke='#fd5f00' yAxisId='left'/> : ''
    }
  </AreaChart>
</ResponsiveContainer>
</div>
  )
}