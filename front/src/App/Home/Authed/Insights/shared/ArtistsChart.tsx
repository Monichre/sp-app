import React from 'react';
import { TPathParams, insightLink, artistLink, navigateTo } from './functions';
import { Link, withRouter, BrowserRouter, RouteComponentProps } from 'react-router-dom';
import { History } from 'history'
import { PerspectiveDashArtists } from '../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Text, LineChart, Line, Tooltip } from 'recharts';
import { BRAND_GLOBAL_COLOR, BRAND_PERSONAL_COLOR, notLargeQuery } from '../../../../../shared/media';
import styled from 'styled-components';
import { Comment } from './Comment';
import max from 'ramda/es/max';
import pluck from 'ramda/es/pluck';
import reduce from 'ramda/es/reduce';
import pipe from 'ramda/es/pipe';

type TickProps = {
  x?: number
  y?: number
  offset?: number
  artist: {
    id: string
    name: string
    images: { url: string }[]
  }
  pathParams: TPathParams
}

const CustomArtistTick: React.SFC<TickProps> = ({x, y, offset, artist, pathParams}) =>{
  // console.log(artist)
  return (
    <Link to={artistLink(pathParams, artist.id)}>
      <clipPath id='clipCircle'>
        <circle r='32px' cx='32px' cy='32px'/>
      </clipPath>
      <Text stroke='white' width={100} textAnchor='end' dx={-88} dy={4} {...{x, y}}>
        {artist.name}
      </Text>
      <image href={artist.images[0] && artist.images[0].url} width='64px' height='64px' clipPath='url(#clipCircle)' transform={`translate(${(x||0)-70},${(y||0)-32})`}/>
    </Link>
  )
}

const navigateToArtist = (history: History, pathParams: TPathParams) => (obj: any) => {
  if (!obj) { return }
  const artistId = obj['activePayload'][0]['payload']['artist']['id']
  console.log('artistId', artistId )
  navigateTo(history, artistLink(pathParams, artistId))
}

const domainMaxBuilder: (values: PerspectiveDashArtists[]) => (maxValue: number) => number =
  // (values: TimescopeDashValues[]) => (maxValue: number) => pipe((vals: TimescopeDashValues[]) => vals.map(v => v.group), reduce(max, -Infinity))(values), 
  (values: PerspectiveDashArtists[]) => (maxValue: number) => Math.ceil(pipe<PerspectiveDashArtists[], number[], number>(pluck('group'), reduce(max, -Infinity))(values))

  const decimalToHrsMins = (value: number) => `${Math.floor(value)}:${Math.floor((value % 1) * 60).toString().padStart(2, '0')}`

type ChartProps = {pathParams: TPathParams, artists: PerspectiveDashArtists[], height?: any}

const ArtistsChart: React.SFC<RouteComponentProps & ChartProps> = ({pathParams, artists, history, height = 70}) =>
  <ResponsiveContainer width='100%' height={(height * artists.length) + 90}>
    <BarChart layout='vertical' data={artists} onClick={navigateToArtist(history, pathParams)}>
      {/* <CartesianGrid stroke='#999'/> */}
      <XAxis height={40} type='number' stroke={BRAND_PERSONAL_COLOR} orientation='top' xAxisId='top' tickFormatter={decimalToHrsMins} domain={[0, domainMaxBuilder(artists)]}>
        <Label position='insideTopLeft' offset={0} stroke={BRAND_PERSONAL_COLOR}>hours</Label>
      </XAxis>
      {/* <XAxis height={40} type='number' stroke={BRAND_GLOBAL_COLOR} orientation='bottom' xAxisId='bottom' tickFormatter={decimalToHrsMins} domain={[0, domainMaxBuilder(artists)]}>
        <Label position='insideBottomLeft' offset={0} stroke={BRAND_GLOBAL_COLOR}>hours by soundpruf</Label>
      </XAxis> */}
      <YAxis width={200} type='category' stroke={BRAND_PERSONAL_COLOR} interval={0}
        tick={({payload, ...props}) => <CustomArtistTick {...props} pathParams={pathParams} artist={artists[payload.value].artist}/>}
        />
      <Tooltip cursor={{fill: 'rgba(216, 216, 216, .05)'}} content={() => <div/>}/>
      {/* <Legend /> */}
      <Bar dataKey='personal' fill={BRAND_PERSONAL_COLOR} xAxisId='top' barSize={5} cursor='pointer' />
      <Bar dataKey='group' fill={BRAND_GLOBAL_COLOR} xAxisId='top' barSize={5}  cursor='pointer'/>
    </BarChart>
  </ResponsiveContainer>

const ArtistsChartWithRouter = withRouter(ArtistsChart)

export const ArtistsChartBlock: React.SFC<{pathParams: TPathParams, artists: PerspectiveDashArtists[], height?: any}> = ({children, ...params}) =>
<div>
  {children}
  { params.artists.length > 0 ?
    <ArtistsChartWithRouter {...params}/> :
    <Comment>I don't see any artists for you here.  Have you <a target='new' href='http://open.spotify.com'>listened to Spotify lately?</a></Comment>
  }
</div>