import React, { useState, useRef } from "react";
import { TPathParams, insightLink, artistLink, navigateTo } from './functions';
import { Link, withRouter, BrowserRouter, RouteComponentProps } from 'react-router-dom';
import { History } from 'history'
import { PerspectiveDashArtists } from '../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Text, LineChart, Line, Tooltip } from 'recharts';
import { BRAND_GLOBAL_COLOR, BRAND_PERSONAL_COLOR, notLargeQuery } from '../../../../../shared/media';
import styled, { css } from 'styled-components';
import { Comment } from './Comment';
import max from 'ramda/es/max';
import pluck from 'ramda/es/pluck';
import reduce from 'ramda/es/reduce';
import { FirstTopListenerAward } from '../../../../../shared/icons'
// front / src / shared / icons.tsx
import pipe from 'ramda/es/pipe';
import { TopListener } from '../../../../../../../back/src/fns/graphql/types';

type TickProps = {
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



const CustomArtistTick: React.SFC<TickProps & any> = React.memo(({ x, y, offset, artist, pathParams, userId }) => {
  
  // let artistLinkRef = useRef();
   
  const { topListeners } = artist
  const [first]: any = topListeners
  const isTopListener: any = first.user.uid === userId
  const userHandle = first.user.displayName ? first.user.displayName : first.user.email


  // topListeners.find((listener: any) => listener.user.uid === userId)
  console.log('TCL: isTopListener', isTopListener)

  const ArtistLink: any = ({ className, isTopListener }: any) => (
    
    <Link to={artistLink(pathParams, artist.id)} className={className} style={{ position: 'relative'
    }}>
      {
        isTopListener ? <image  href='/icons/first-award.png' transform={`translate(${(x || 0) - 200},${(y || 0) - 10})`}
        /> : null
      }
      <clipPath id='clipCircle'>
        <circle r='32px' cx='32px' cy='32px' />
      </clipPath>
      <Text stroke='white' width={100} font-size="14" textAnchor='end' dx={-78} dy={4} {...{ x, y }}>
        {artist.name} 
      </Text>
      {
        isTopListener ? <Text stroke='#64d6ee' width={100} font-size="10" height={20} textAnchor='end' dx={-78} dy={24} {...{ x, y }}>
          {userHandle}
        </Text> : null
      }
      <image href={artist.images[0] && artist.images[0].url} width='64px' height='64px' clipPath='url(#clipCircle)' transform={`translate(${(x || 0) - 70},${(y || 0) - 32})`}
  />
      </Link>
      
  )


  return <ArtistLink isTopListener={isTopListener} className={`${artist.name.length > 1 ?artist.name.split(' ').join('-').toLowerCase() : artist.name.toLowerCase()} ${isTopListener ? 'isTopListener' : ''}`}/>
})

const navigateToArtist = (history: History, pathParams: TPathParams) => (obj: any) => {
  if (!obj) { return }
  const artistId = obj['activePayload'][0]['payload']['artist']['id']
  console.log('artistId', artistId)
  navigateTo(history, artistLink(pathParams, artistId))
}

const domainMaxBuilder: (values: PerspectiveDashArtists[]) => (maxValue: number) => number =
  // (values: TimescopeDashValues[]) => (maxValue: number) => pipe((vals: TimescopeDashValues[]) => vals.map(v => v.group), reduce(max, -Infinity))(values), 
  (values: PerspectiveDashArtists[]) => (maxValue: number) => Math.ceil(pipe<PerspectiveDashArtists[], number[], number>(pluck('group'), reduce(max, -Infinity))(values))

const decimalToHrsMins = (value: number) => `${Math.floor(value)}:${Math.floor((value % 1) * 60).toString().padStart(2, '0')}`

type ChartProps = { pathParams: TPathParams, artists: PerspectiveDashArtists[], height?: any }

const ArtistsChart: React.SFC<RouteComponentProps & ChartProps & UserIdProp> = ({ pathParams, artists, history, height = 70, userId }) => (
    <ResponsiveContainer width='100%' height={(height * artists.length) + 90}>
     
      <BarChart layout='vertical' data={artists} onClick={navigateToArtist(history, pathParams)}>
        {/* <CartesianGrid stroke='#999'/> */}
        <XAxis height={40} type='number' stroke={BRAND_PERSONAL_COLOR} orientation='top' xAxisId='top' tickFormatter={decimalToHrsMins} domain={[0, domainMaxBuilder(artists)]}>
          <Label position='insideTopLeft' offset={0} stroke={BRAND_PERSONAL_COLOR}>hours</Label>
        </XAxis>

        <YAxis width={200} type='category' stroke={BRAND_PERSONAL_COLOR} interval={0}
          tick={({ payload, ...props }) =>
            <CustomArtistTick {...props} pathParams={pathParams} artist={artists[payload.value].artist} userId={userId} /> }
        />
        <Tooltip cursor={{ fill: 'rgba(216, 216, 216, .05)' }} content={() => <div />} />
        {/* <Legend /> */}
        <Bar dataKey='personal' fill={BRAND_PERSONAL_COLOR} xAxisId='top' barSize={5} cursor='pointer' />
        <Bar dataKey='group' fill={BRAND_GLOBAL_COLOR} xAxisId='top' barSize={5} cursor='pointer' />
      </BarChart>
    </ResponsiveContainer>

)
 
const ArtistsChartWithRouter = withRouter(ArtistsChart)

export const ArtistsChartBlock: React.SFC<{ pathParams: TPathParams, artists: PerspectiveDashArtists[], height?: any } & UserIdProp> = ({ children, userId, ...params }) =>
  <div>
    {children}
    {params.artists.length > 0 ?
      <ArtistsChartWithRouter {...params} userId={userId} /> :
      <Comment>I don't see any artists for you here.  Have you <a target='new' href='http://open.spotify.com'>listened to Spotify lately?</a></Comment>
    }
  </div>