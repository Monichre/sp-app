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



const CustomArtistTick: React.SFC<TickProps> = React.memo(({ x, y, offset, artist, pathParams }) => {


  const ArtistLink: any = ({ className }: any) => (
    
    <Link to={artistLink(pathParams, artist.id)} className={className} style={{ position: 'relative'
    }}>
    
      <clipPath id='clipCircle'>
        <circle r='32px' cx='32px' cy='32px' />
      </clipPath>
      <Text stroke='white' width={100} font-size="14" textAnchor='end' dx={-78} dy={4} {...{ x, y }}>
        {artist.name} 
      </Text>
     
      <image href={artist.images[0] && artist.images[0].url} width='64px' height='64px' clipPath='url(#clipCircle)' transform={`translate(${(x || 0) - 70},${(y || 0) - 32})`}
  />
      </Link>
      
  )


  return <ArtistLink className={`${artist.name.length > 1 ?artist.name.split(' ').join('-').toLowerCase() : artist.name.toLowerCase()}`}/>
})

const TopListenerYaxis: React.SFC<TickProps & any> = React.memo(({ x, y, offset, artist, pathParams, userId }) => {

  const { topListeners } = artist
  const [first, second = false, third = false]: any = topListeners
  console.log('TCL: third', third)
  console.log('TCL: second', second)
  console.log('TCL: first', first)
  const isTopListener: any = first ? first.user.uid === userId : false
  const isSecond: any = second ? second.user.uid === userId : false
  console.log('TCL: isSecond', isSecond)
  const isThird: any = third ? third.user.uid === userId : false
  console.log('TCL: isThird', isThird)

  const topListenerHandle: any = first && first.user.displayName ? first.user.displayName : first && first.user.email ? first.user.email : null
  const secondListenerHandle: any = second && second.user.displayName ? second.user.displayName : second && second.user.email ? second.user.email : null
  const firstPlaceBadge: any = '/icons/first-currentUser.png'
  const secondPlaceBadge = '/icons/second-currentUser.png'



  console.log('TCL: isTopListener', isTopListener)

  const TopListenerLink: any = ({ className, isTopListener }: any) => (

    <Link to={artistLink(pathParams, artist.id)} className={className} style={{
      position: 'relative'
    }}>
      {
        isTopListener ? <image href={firstPlaceBadge} transform={`translate(${(x || 0) + 15}, ${(y || 0) - 20})`} width='30px' height='30px' 
        /> : first && first.user.photoURL ? <image href={first.user.photoURL} width='32px' height='32px' clipPath='url(#clipCircle2)' transform={`translate(${(x || 0) + 15}, ${(y || 0) - 20})`} /> : first ? <Text stroke='#64d6ee' width={100} font-size="10" height={20} textAnchor='end' dx={-78} dy={24} {...{ x, y }}>
            {topListenerHandle}
          </Text> : null
      }
      
      {
        isSecond ? <image href={secondPlaceBadge} transform={`translate(${(x || 0) + 45}, ${(y || 0) - 20})`} width='30px' height='30px'
        /> : second && second.user.photoURL ? <image href={second.user.photoURL} width='32px' height='32px' clipPath='url(#clipCircle2)' transform={`translate(${(x || 0) + 45}, ${(y || 0) - 20})`} /> : second && second.user ? <Text stroke='#64d6ee' width={100} font-size="10" height={20} textAnchor='end' dx={-78} dy={24} {...{ x, y }}>
          {secondListenerHandle}
        </Text> : null
      }

      
      <clipPath id='clipCircle2'>
        <circle r='16px' cx='16px' cy='16px' />
      </clipPath>
 
    </Link>

  )


  return <TopListenerLink isTopListener={isTopListener} className={`${artist.name.length > 1 ? artist.name.split(' ').join('-').toLowerCase() : artist.name.toLowerCase()} ${isTopListener ? 'isTopListener' : ''}`} />
})


const CustomTip: any = ({ active, payload, label }: any) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
        
        <p className="desc">Anything you want can be displayed here.</p>
      </div>
    );
  }

  return null;
};



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
        
        <XAxis height={30} type='number' stroke={BRAND_PERSONAL_COLOR} orientation='top' xAxisId='top' tickFormatter={decimalToHrsMins} domain={[0, domainMaxBuilder(artists)]}>
          <Label position='insideTopLeft' offset={0} stroke={BRAND_PERSONAL_COLOR}>hours</Label>
        </XAxis>

      <YAxis width={200} yAxisId="left" orientation="left" type='category' stroke={BRAND_PERSONAL_COLOR} interval={0} tick={({ payload, ...props }) =>
            <CustomArtistTick {...props} pathParams={pathParams} artist={artists[payload.value].artist} /> }
      />

      <YAxis width={50} yAxisId="right" orientation="right" type='category' stroke={BRAND_PERSONAL_COLOR} interval={0} tick={({ payload, ...props }) =>
        <TopListenerYaxis {...props}   pathParams={pathParams} artist={artists[payload.value].artist} userId={userId} />}
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