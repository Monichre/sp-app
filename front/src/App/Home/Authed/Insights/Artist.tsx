import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { TPathParams } from './shared';
import { StatPage } from './shared';
import { InsightsBackLink } from './shared/InsightsBackLink';
import { useInsightsStats, useInsightsArtistStats } from '../../../../types';
import { SpotifyLogoLink } from '../../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import { TimeseriesChart } from './shared/TimeseriesChart';

const ArtistBanner = styled.div<{src: string}>`
  display: flex;
  align-items: center;
  background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url("${({src}) => src}");
  background-size: cover;
  background-position: center center;
  min-height: 12rem;
  margin: 1rem -1rem 0rem -1rem;
  padding: 0rem 1rem 0rem 1rem;
  @media (max-width: 800px) {
    margin-top: 0;
    min-height: 6rem;
  }
  & > * {
    margin-right: 2rem;
  }
`

const ArtistTitle = styled.div`
  font-weight: 500;
  font-size: 3rem;
  @media (max-width: 800px) {
    font-size: 1.5rem;
  }
`

export const Artist: React.SFC<RouteComponentProps<{artistId: string}> & { uid: string, pathParams: TPathParams }> =
({uid, history, match: {path, params: { artistId }}, pathParams}) => {
  const {data} = useInsightsArtistStats({variables: { uid, artistId }, suspend: true})
  if (!data || !data.insightsArtistStats) { throw new Error('couldnt get insightsStats') } // due to suspense this should never happen, but i want to type-safe the thing
  const stats = data.insightsArtistStats
  const artist = stats.artist
  const imgUrl = stats.artist.images[0] && stats.artist.images[0].url
  const timeseries = stats[pathParams.timeScope].timeseries
  // const focus = path.split('/').slice(4,99).join('/')
  return <StatPage {...{stats, history, path, pathParams}}>
    <ArtistBanner src={imgUrl}>
      <InsightsBackLink/>
      <ArtistTitle>{artist.name}</ArtistTitle>
      <SpotifyLogoLink href={artist.external_urls.spotify} size='48px'/>
    </ArtistBanner>
    <TimeseriesChart timeseries={timeseries}/>
  </StatPage>
}
