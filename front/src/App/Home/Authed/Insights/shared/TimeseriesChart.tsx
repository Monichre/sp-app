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

const domainMaxBuilder: (values: TimescopeDashValues[]) => (maxValue: number) => number =
  // (values: TimescopeDashValues[]) => (maxValue: number) => pipe((vals: TimescopeDashValues[]) => vals.map(v => v.group), reduce(max, -Infinity))(values), 
  (values: TimescopeDashValues[]) => (maxValue: number) => Math.ceil(pipe<TimescopeDashValues[], number[], number>(pluck('group'), reduce(max, -Infinity))(values))

  const decimalToHrsMins = (value: number) => `${Math.floor(value)}:${Math.floor((value % 1) * 60).toString().padStart(2, '0')}`

const TooltipDiv = styled.div`
background-color: #666;
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

const CustomTooltip: React.SFC<TooltipProps> = ({active, label, payload}) =>
  active ? <TooltipDiv>
    <TooltipTitle>{label}</TooltipTitle>
    { payload && payload[1] &&
      <TooltipItem>
        <TooltipLabel color={BRAND_PERSONAL_COLOR}>You</TooltipLabel>
        <TooltipValue color={BRAND_PERSONAL_COLOR}>{decimalToHrsMins(payload[1].value as number)}</TooltipValue>
      </TooltipItem>
    }
    { payload && payload[0] &&
      <TooltipItem>
        <TooltipLabel color={BRAND_GLOBAL_COLOR}>Soundpruf</TooltipLabel>
        <TooltipValue color={BRAND_GLOBAL_COLOR}>{decimalToHrsMins(payload[0].value as number)}</TooltipValue>
      </TooltipItem>
    }
  </TooltipDiv> : <></>

export const TimeseriesChart: React.SFC<{timeSeries: TimescopeDashTimeSeries}> = ({timeSeries}) =>
<div>
<BlockTitle>{timeSeries.label}</BlockTitle>
<ResponsiveContainer width='100%' height={240}>
  <AreaChart data={timeSeries.values}>
    {/* <CartesianGrid stroke='#999'/> */}
    <XAxis dataKey='period' stroke='#ccc' textAnchor='middle' tickMargin={12}>
    </XAxis>
    {/* <Tooltip content={<CustomTooltip/>}/> */}
    {/* <YAxis yAxisId='left' type='number' stroke={BRAND_PERSONAL_COLOR} interval={0} orientation='left' tickFormatter={Math.floor} allowDecimals={true} domain={[0, domainMaxBuilder(timeSeries.values)]}> */}
    <YAxis yAxisId='left' type='number' stroke={BRAND_PERSONAL_COLOR} interval={0} orientation='left' tickFormatter={decimalToHrsMins} allowDecimals={true} domain={[0, domainMaxBuilder(timeSeries.values)]}>
      <Label position='left' angle={90} offset={-8}  y={-32} stroke={BRAND_PERSONAL_COLOR}>hours</Label>
    </YAxis>
    {/* <YAxis yAxisId='right' type='number' stroke={BRAND_GLOBAL_COLOR} interval={0} orientation='right' tickFormatter={Math.floor} allowDecimals={false}>
      <Label position='right' angle={90} offset={-4} stroke={BRAND_GLOBAL_COLOR}>hours by soundpruf</Label>
    </YAxis> */}
    <Area dataKey='group' stackId="1" fill={BRAND_GLOBAL_COLOR} stroke={BRAND_GLOBAL_COLOR} yAxisId='left'/>
    <Area dataKey='personal' stackId="2" fill={BRAND_PERSONAL_COLOR} stroke={BRAND_PERSONAL_COLOR} yAxisId='left'/>
  </AreaChart>
</ResponsiveContainer>
</div>