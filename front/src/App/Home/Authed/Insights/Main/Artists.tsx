import React from 'react';
import { RouteComponentProps } from 'react-router';
import { TPathParams, ArtistsChartBlock } from '../shared';
import { InsightsBackLink } from '../shared/InsightsBackLink';
import { useInsightsArtists } from '../../../../../types';

export const Artists: React.SFC<RouteComponentProps & { uid: string, pathParams: TPathParams }> =
({uid, history, match: {path}, pathParams}) => {
  const {data} = useInsightsArtists({variables: { uid }, suspend: true})
  if (!data || !data.insightsArtists) { throw new Error('couldnt get insightsArtists') } // due to suspense this should never happen, but i want to type-safe the thing
  const allStats = data.insightsArtists
  const artists = allStats[pathParams.timeScope][pathParams.perspective]

  return <>
    <h1><InsightsBackLink/> Top Artists</h1>
    <ArtistsChartBlock artists={artists} pathParams={pathParams}/>
  </>
}