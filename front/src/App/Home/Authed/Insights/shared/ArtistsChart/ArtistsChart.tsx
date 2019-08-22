import React, { useState, useRef } from "react";
import { TPathParams, insightLink, artistLink, navigateTo } from '../functions';
import { Link, withRouter, BrowserRouter, RouteComponentProps } from 'react-router-dom';
import { History } from 'history'
import { PerspectiveDashArtists } from '../../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Text, LineChart, Line, Tooltip } from 'recharts';
import { BRAND_GLOBAL_COLOR, BRAND_PERSONAL_COLOR, notLargeQuery } from '../../../../../../shared/media';
import { Comment } from '../Comment';
import max from 'ramda/es/max';
import pluck from 'ramda/es/pluck';
import reduce from 'ramda/es/reduce';
import styled from 'styled-components';
import pipe from 'ramda/es/pipe';
import {hrsAndMins, decimalToHrsMins} from '../../../../../../lib/durationFormats'
import { TopListenerYaxis } from './TopListenerYAxis'
import { CustomArtistTick } from './CustomArtistTick'


export type TickProps = {
  x?: number
  y?: number
  offset?: number
  artist: {
    id: string
    name: string
    images: { url: string }[],
    topListeners: {}[]
  },
  userId: string,
  revealTopListener: Function
  pathParams: TPathParams
}

type UserIdProp = {
  userId: string
}








const navigateToArtist = (history: History, pathParams: TPathParams) => (obj: any) => {
  if (!obj) { return }
  const artistId = obj['activePayload'][0]['payload']['artist']['id']
  console.log('artistId', artistId)
  navigateTo(history, artistLink(pathParams, artistId))
}

const domainMaxBuilder: (values: PerspectiveDashArtists[]) => (maxValue: number) => number =
  (values: PerspectiveDashArtists[]) => (maxValue: number) => Math.ceil(pipe<PerspectiveDashArtists[], number[], number>(pluck('group'), reduce(max, -Infinity))(values))



type ChartProps = { pathParams: TPathParams, artists: PerspectiveDashArtists[], height?: any }

const ArtistsChart: React.SFC<RouteComponentProps & ChartProps & UserIdProp> = ({ pathParams, artists, history, height = 70, userId }) => (
    <ResponsiveContainer width='100%' height={(height * artists.length) + 90}>
     
      <BarChart layout='vertical' data={artists} onClick={navigateToArtist(history, pathParams)}>
        
        <XAxis height={30} type='number' stroke='#fff' orientation='top' xAxisId='top' tickFormatter={decimalToHrsMins} domain={[0, domainMaxBuilder(artists)]}>
          <Label position='insideTopLeft' offset={0} stroke='#fff'>hours</Label>
        </XAxis>

      <YAxis width={150} yAxisId="left" orientation="left" type='category' stroke={BRAND_PERSONAL_COLOR} interval={0} tick={({ payload, ...props }) =>
            <CustomArtistTick {...props} pathParams={pathParams} artist={artists[payload.value].artist} /> }
      />

      <YAxis width={75} yAxisId="right" orientation="right" type='category' stroke={BRAND_PERSONAL_COLOR} interval={0} tick={({ payload, ...props }) =>
        <TopListenerYaxis {...props} pathParams={pathParams} artist={artists[payload.value].artist} totalTimeListened={artists[payload.value].personal} userId={userId} />}
      />
      
      
      {/* <Tooltip cursor={{ fill: 'rgba(216, 216, 216, .05)' }} content={<CustomTip />} /> */}
        
        <Bar dataKey='personal' fill={BRAND_PERSONAL_COLOR} xAxisId='top' yAxisId="left" barSize={5} cursor='pointer' />
      <Bar dataKey='group' fill={BRAND_GLOBAL_COLOR} xAxisId='top' yAxisId="left" barSize={5} cursor='pointer' />
      
    
      </BarChart>
    </ResponsiveContainer>

)
 
const ArtistsChartWithRouter = withRouter(ArtistsChart)

export const ArtistsChartBlock: React.SFC<{ pathParams: TPathParams, artists: PerspectiveDashArtists[], height?: any } & UserIdProp> = ({ children, ...params }) =>
  <div>
    {children}
    {params.artists.length > 0 ?
      <ArtistsChartWithRouter {...params} /> :
      <Comment>I don't see any artists for you here.  Have you <a target='new' href='http://open.spotify.com'>listened to Spotify lately?</a></Comment>
    }
  </div>