import React from 'react';
import { RouteComponentProps } from 'react-router';
import { TPathParams, ArtistsChartBlock } from '../shared';
import { InsightsBackLink } from '../shared/InsightsBackLink';
import { useInsightsArtists } from '../../../../../types';
import { suspensefulHook } from '../../../../../lib/suspensefulHook';

export const Artists: React.SFC<RouteComponentProps & { uid: string, pathParams: TPathParams }> = ({uid, pathParams}) => {
  const { insightsArtists: { [pathParams.timeScope]: { [pathParams.perspective]: artists } } } = suspensefulHook(useInsightsArtists({ variables: { uid }, suspend: true }))
  
  const normalizetimeScopeMap: any = {
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    life: 'Life Time',

  }
  const { timeScope, perspective }: any = pathParams
  const translatedPerspective: string = perspective === 'personal' ? 'Your' : 'Everyone'



  console.log('TCL: artists', artists)

  return (
    <>
      <h1 style={{ color: '#fff' }}><InsightsBackLink /> {translatedPerspective} Top Artists {normalizetimeScopeMap[timeScope]} </h1>
      {artists && artists.length ? <ArtistsChartBlock {...{ artists, pathParams }} userId={uid} /> : <p>Loading</p>}
      
      {/* artists */}
      </>
  )
}