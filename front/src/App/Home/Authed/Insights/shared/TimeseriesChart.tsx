import React from 'react';
import { PerspectiveDashArtists, TimescopeDashTimeSeries, useInsightsDash, useInsightsStats } from '../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Text, LineChart, Line } from 'recharts';
import { BRAND_GLOBAL_COLOR, BRAND_PERSONAL_COLOR, notLargeQuery, largeQuery } from '../../../../../shared/media';
import styled from 'styled-components';
import { BlockTitle, BlockTitleMore } from '../shared/BlockTitle';

export const TimeseriesChart: React.SFC<{timeseries: TimescopeDashTimeSeries}> = ({timeseries}) =>
<div>
<BlockTitle>{timeseries.label}</BlockTitle>
<ResponsiveContainer width='100%' height={240}>
  <LineChart data={timeseries.values}>
    {/* <CartesianGrid stroke='#999'/> */}
    <XAxis dataKey='period' stroke='#ccc' textAnchor='middle' tickMargin={12}>
    </XAxis>
    <YAxis yAxisId='left' type='number' stroke={BRAND_PERSONAL_COLOR} interval={0} orientation='left'>
      <Label position='left' angle={90} offset={-8}  y={-32} stroke={BRAND_PERSONAL_COLOR}>hours by you</Label>
    </YAxis>
    <YAxis yAxisId='right' type='number' stroke={BRAND_GLOBAL_COLOR} interval={0} orientation='right'>
      <Label position='right' angle={90} offset={-4} stroke={BRAND_GLOBAL_COLOR}>hours by soundpruf</Label>
    </YAxis>
    <Line dataKey='group' fill={BRAND_GLOBAL_COLOR} stroke={BRAND_GLOBAL_COLOR} yAxisId='right'/>
    <Line dataKey='personal' fill={BRAND_PERSONAL_COLOR} stroke={BRAND_PERSONAL_COLOR} yAxisId='left'/>
  </LineChart>
</ResponsiveContainer>
</div>