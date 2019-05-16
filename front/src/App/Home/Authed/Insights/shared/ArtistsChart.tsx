import React from 'react';
import { TPathParams, insightLink } from './functions';
import { Link } from 'react-router-dom';
import { PerspectiveDashArtists } from '../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Text, LineChart, Line } from 'recharts';
import { BRAND_GLOBAL_COLOR, BRAND_PERSONAL_COLOR, notLargeQuery } from '../../../../../shared/media';
import styled from 'styled-components';
import { Comment } from './Comment';

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
    <Link to={insightLink(Object.assign({}, pathParams, { focus: `artists/${artist.id}`}))}>
    <clipPath id='clipCircle'>
      <circle r='32px' cx='32px' cy='32px'/>
    </clipPath>
    <Text stroke='white' width={100} textAnchor='end' dx={-88} dy={4} {...{x, y}}>{artist.name}</Text>
    <image href={artist.images[0] && artist.images[0].url} width='64px' height='64px' clipPath='url(#clipCircle)' transform={`translate(${(x||0)-70},${(y||0)-32})`}/>
    </Link>
  )
}

const ArtistsChart: React.SFC<{pathParams: TPathParams, artists: PerspectiveDashArtists[], height?: any}> = ({pathParams, artists, children, height = 70}) =>
  <ResponsiveContainer width='100%' height={(height * artists.length) + 90}>
    <BarChart layout='vertical' data={artists}>
      {/* <CartesianGrid stroke='#999'/> */}
      <XAxis height={40} type='number' stroke={BRAND_PERSONAL_COLOR} orientation='top' xAxisId='top'>
        <Label position='insideTopLeft' offset={0} stroke={BRAND_PERSONAL_COLOR}>hours by you</Label>
      </XAxis>
      <XAxis height={40} type='number' stroke={BRAND_GLOBAL_COLOR} orientation='bottom' xAxisId='bottom'>
        <Label position='insideBottomLeft' offset={0} stroke={BRAND_GLOBAL_COLOR}>hours by soundpruf</Label>
      </XAxis>
      <YAxis width={200} type='category' stroke={BRAND_PERSONAL_COLOR} interval={0}
        tick={({payload, ...props}) => <CustomArtistTick {...props} pathParams={pathParams} artist={artists[payload.value].artist}/>}
        />
      {/* <Tooltip /> */}
      {/* <Legend /> */}
      <Bar dataKey='personal' fill={BRAND_PERSONAL_COLOR} xAxisId='top'/>
      <Bar dataKey='group' fill={BRAND_GLOBAL_COLOR} xAxisId='bottom'/>
    </BarChart>
  </ResponsiveContainer>

export const ArtistsChartBlock: React.SFC<{pathParams: TPathParams, artists: PerspectiveDashArtists[], height?: any}> = ({children, ...params}) =>
<div>
  {children}
  { params.artists.length > 0 ?
    <ArtistsChart {...params}/> :
    <Comment>I don't see any artists for you here.  Have you <a target='new' href='http://open.spotify.com'>listened to Spotify lately?</a></Comment>
  }
</div>