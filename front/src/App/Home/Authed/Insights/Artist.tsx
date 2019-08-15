import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { TPathParams } from './shared';
import { StatPage } from './shared';
import { InsightsBackLink } from './shared/InsightsBackLink';
import { useInsightsArtistStats, ArtistFragmentFragment } from '../../../../types';
import { SpotifyLogoLink } from '../../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import { TimeseriesChart } from './shared/TimeseriesChart';
import { ArtistTopListeners } from './ArtistTopListeners'
import { suspensefulHook } from '../../../../lib/suspensefulHook';

const ArtistBannerDiv = styled.div<{backgroundUrl: string}>`
  display: flex;
  align-items: center;
  background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url("${({backgroundUrl}) => backgroundUrl}");
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

const ArtistBanner: React.SFC<{artist: ArtistFragmentFragment}> = ({artist}) => {
  const { name, images, external_urls: { spotify }, topListeners } = artist
  const backgroundUrl = images[0] && images[0].url
  return <ArtistBannerDiv {...{backgroundUrl}}>
    <InsightsBackLink/>
    <ArtistTitle>{name}</ArtistTitle>
    <SpotifyLogoLink href={spotify} size='48px' />    
    {topListeners && topListeners.length ? <ArtistTopListeners topListeners={topListeners} /> : null}

  </ArtistBannerDiv>
}

export const Artist: React.SFC<RouteComponentProps<{artistId: string}> & { uid: string, pathParams: TPathParams }> =
({uid, history, match: {path, params: { artistId }}, pathParams}) => {

  const { insightsArtistStats: stats } = suspensefulHook(useInsightsArtistStats({ variables: { uid, artistId }, suspend: true }))
  console.log('TCL: stats', stats)
  
  const { artist, [pathParams.timeScope]: { timeseries: timeSeries }} = stats
  
  return (
    <StatPage {...{ stats, history, path, pathParams }}>
      <ArtistBanner {...{ artist }} />
      <TimeseriesChart {...{ timeSeries }} />
    </StatPage>
  )
}
