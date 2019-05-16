import React from 'react';
import { TPathParams, insightLink } from './functions';
import { Link } from 'react-router-dom';
import { PerspectiveDashGenres } from '../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Text, LineChart, Line } from 'recharts';
import { BRAND_GLOBAL_COLOR, BRAND_PERSONAL_COLOR, notLargeQuery } from '../../../../../shared/media';
import { Comment } from './Comment';

type TickProps = {
  x?: number
  y?: number
  offset?: number
  genre: string
  pathParams: TPathParams
}

const CustomTick: React.SFC<TickProps> = ({x, y, offset, genre, pathParams}) =>{
  console.log(genre)
  return (
    <Link to={insightLink(Object.assign({}, pathParams, { focus: `genres/${genre}`}))}>
    <Text stroke='white' width={100} textAnchor='end' dx={-24} dy={4} {...{x, y}}>{genre}</Text>
    </Link>
  )
}
const GenresChart: React.SFC<{pathParams: TPathParams, genres: PerspectiveDashGenres[], height?: any}> = ({pathParams, genres, children, height = 70}) =>
<div>
  {children}
  <ResponsiveContainer width='100%' height={(height * genres.length) + 90}>
    <BarChart layout='vertical' data={genres}>
      {/* <CartesianGrid stroke='#999'/> */}
      <XAxis height={40} type='number' stroke={BRAND_PERSONAL_COLOR} orientation='top' xAxisId='top'>
        <Label position='insideTopLeft' offset={0} stroke={BRAND_PERSONAL_COLOR}>hours by you</Label>
      </XAxis>
      <XAxis height={40} type='number' stroke={BRAND_GLOBAL_COLOR} orientation='bottom' xAxisId='bottom'>
        <Label position='insideBottomLeft' offset={0} stroke={BRAND_GLOBAL_COLOR}>hours by soundpruf</Label>
      </XAxis>
      <YAxis width={136} type='category' stroke={BRAND_PERSONAL_COLOR} interval={0}
        tick={({payload, ...props}) => <CustomTick {...props} pathParams={pathParams} genre={genres[payload.value].genre}/>}
        />
      {/* <Tooltip /> */}
      {/* <Legend /> */}
      <Bar dataKey='personal' fill={BRAND_PERSONAL_COLOR} xAxisId='top'/>
      <Bar dataKey='group' fill={BRAND_GLOBAL_COLOR} xAxisId='bottom'/>
    </BarChart>
  </ResponsiveContainer>
</div>

export const GenresChartBlock: React.SFC<{pathParams: TPathParams, genres: PerspectiveDashGenres[], height?: any}> = ({children, ...params}) =>
  <div>
    {children}
    { params.genres.length > 0 ?
      <GenresChart {...params}/> :
      <Comment>I don't see any genres for you here.  Have you <a target='new' href='http://open.spotify.com'>listened to Spotify lately?</a></Comment>
    }
  </div>
