import React from 'react';
import { RouteComponentProps } from 'react-router';
import { TPathParams } from '../shared';
import { InsightsBackLink } from '../shared/InsightsBackLink';
import { useInsightsGenres } from '../../../../../types';
import { GenresChartBlock } from '../shared/GenresChart';

export const Genres: React.SFC<RouteComponentProps & { uid: string, pathParams: TPathParams }> =
({uid, history, match: {path}, pathParams}) => {
  const {data} = useInsightsGenres({variables: { uid }, suspend: true})
  if (!data || !data.insightsGenres) { throw new Error('couldnt get insightsGenres') } // due to suspense this should never happen, but i want to type-safe the thing
  const allStats = data.insightsGenres
  const genres = allStats[pathParams.timeScope][pathParams.perspective]

  return <>
    <h1><InsightsBackLink/> Top Genres</h1>
    <GenresChartBlock genres={genres} pathParams={pathParams}/>
  </>
}