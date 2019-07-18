import React from 'react';
import { RouteComponentProps } from 'react-router';
import { TPathParams, ArtistsChartBlock } from '../shared';
import { InsightsBackLink } from '../shared/InsightsBackLink';
import { useInsightsArtists } from '../../../../../types';
import { suspensefulHook } from '../../../../../lib/suspensefulHook';

export const Artists: React.SFC<RouteComponentProps & { uid: string, pathParams: TPathParams }> = ({uid, pathParams}) => {
  const { insightsArtists: { [pathParams.timeScope]: { [pathParams.perspective]: artists }}} = suspensefulHook(useInsightsArtists({variables: { uid }, suspend: true}))
  console.log('TCL: artists', artists)

  return (
    <ArtistsChartBlock {...{ artists, pathParams }} userId={uid}>
      <h1><InsightsBackLink/> Top Artists</h1>
    </ArtistsChartBlock>
  )
}