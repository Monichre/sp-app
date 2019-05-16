import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { TPathParams, insightLink } from '../shared/functions';
import { PerspectiveDashArtists, TimescopeDashTimeSeries, useInsightsDash, useInsightsStats } from '../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Text, LineChart, Line } from 'recharts';
import { BRAND_GLOBAL_COLOR, BRAND_PERSONAL_COLOR, notLargeQuery, largeQuery } from '../../../../../shared/media';
import styled from 'styled-components';
import { VerticalSpacer } from '../../../../../shared/VerticalSpacer';
import { useInsightsData } from '../mock';
import { ArtistsChartBlock } from '../shared/ArtistsChart';
import { BlockTitle, BlockTitleMore } from '../shared/BlockTitle';
import { GenresChartBlock } from '../shared/GenresChart';
import { TimeseriesChart } from '../shared/TimeseriesChart';



const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  ${notLargeQuery`
    flex-direction: column;
  `}
  ${largeQuery`
    & > div {
      flex: 1;
      margin-left: 2rem;
    }
    & > div:nth-child(1) {
      margin-left: 0;
    }
  `}
`

export const Overview: React.SFC<RouteComponentProps & { uid: string, pathParams: TPathParams }> =
({uid, history, match: {path}, pathParams}) => {
  // const allStats = useInsightsData()
  const { data, error, errors, loading } = useInsightsDash({ variables: { uid }, suspend: true})
  if (!data || !data.insightsDash || error || errors ) { throw new Error(JSON.stringify({error, errors, data, loading}, null, 2))}
  const allStats = data.insightsDash
  const timeseries = allStats[pathParams.timeScope].timeSeries
  const artists = allStats[pathParams.timeScope][pathParams.perspective].artists
  const genres = allStats[pathParams.timeScope][pathParams.perspective].genres
  console.log('genres', genres)
  // const stats = FAKE[pathParams.timeScope][pathParams.perspective].artists
  return <>
    <TimeseriesChart {...{timeseries}}/>
    <Row>
      <ArtistsChartBlock artists={artists} pathParams={pathParams}>
        <BlockTitle to={`${insightLink(pathParams)}/artists`}>Top Artists <BlockTitleMore>see all</BlockTitleMore></BlockTitle>
      </ArtistsChartBlock>
      <GenresChartBlock genres={genres} pathParams={pathParams}>
        <BlockTitle to={`${insightLink(pathParams)}/genres`}>Top Genres <BlockTitleMore>see all</BlockTitleMore></BlockTitle>
      </GenresChartBlock>
    </Row>
    <VerticalSpacer height='100px'/>
  </>
}
