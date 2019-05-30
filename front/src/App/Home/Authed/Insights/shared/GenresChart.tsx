import React from 'react';
import { TPathParams, insightLink, navigateTo, genreLink } from './functions';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { History } from 'history'
import { PerspectiveDashGenres } from '../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Text, LineChart, Line, Tooltip, TooltipProps } from 'recharts';
import { BRAND_GLOBAL_COLOR, BRAND_PERSONAL_COLOR, notLargeQuery } from '../../../../../shared/media';
import { Comment } from './Comment';
import max from 'ramda/es/max';
import pluck from 'ramda/es/pluck';
import reduce from 'ramda/es/reduce';
import pipe from 'ramda/es/pipe';

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

const navigateToGenre = (history: History, pathParams: TPathParams) => (obj: any) => {
  if (!obj) { return }
  const genre = obj['activePayload'][0]['payload']['genre']
  console.log('genre', genre )
  navigateTo(history, genreLink(pathParams, genre))
}

type BarXAxisProps = {
  stroke: string
  orientation: 'top' | 'bottom'
  position: 'insideTopLeft' | 'insideBottomLeft'
}
const BarXAxis: React.SFC<BarXAxisProps> = ({stroke, orientation, position}) =>
  <XAxis height={40} type='number' stroke={stroke} orientation={orientation} xAxisId={orientation} tickFormatter={Math.floor} allowDecimals={false}>
    <Label position={position} offset={0} stroke={stroke}>hours by you</Label>
  </XAxis>

const BarXAxisPersonal: React.SFC = () =>
  <BarXAxis {...{stroke: BRAND_PERSONAL_COLOR, orientation: 'top', position: 'insideTopLeft'}}/>

  const BarXAxisGroup: React.SFC = () =>
  <BarXAxis {...{stroke: BRAND_GLOBAL_COLOR, orientation: 'bottom', position: 'insideBottomLeft'}}/>

// const BarComparisonChart: React.SFC<ChartProps<T>> = (arg: T, {pathParams, data, history, height = 70}) => {
// return <BarChart layout='vertical' data={data} onClick={navigateToGenre(history, pathParams)}>
// {/* <CartesianGrid stroke='#999'/> */}
// {/* <BarXAxisPersonal/>
// <BarXAxisGroup/> */}
// <XAxis height={40} type='number' stroke={BRAND_PERSONAL_COLOR} orientation='top' xAxisId='top' tickFormatter={Math.floor} allowDecimals={false}>
//   <Label position='insideTopLeft' offset={0} stroke={BRAND_PERSONAL_COLOR}>hours by you</Label>
// </XAxis>
// <XAxis height={40} type='number' stroke={BRAND_GLOBAL_COLOR} orientation='bottom' xAxisId='bottom' tickFormatter={Math.floor} allowDecimals={false}>
//   <Label position='insideBottomLeft' offset={0} stroke={BRAND_GLOBAL_COLOR}>hours by soundpruf</Label>
// </XAxis>
// <YAxis width={136} type='category' stroke={BRAND_PERSONAL_COLOR} interval={0}
//   tick={({payload, ...props}) => <CustomTick {...props} pathParams={pathParams} genre={genres[payload.value].genre}/>}
//   />
// <Tooltip cursor={{fill: '#666'}} content={() => <div/>}/>
// {/* <Legend /> */}
// <Bar dataKey='personal' fill={BRAND_PERSONAL_COLOR} xAxisId='top' cursor='pointer'/>
// <Bar dataKey='group' fill={BRAND_GLOBAL_COLOR} xAxisId='bottom' cursor='pointer'/>
// </BarChart>
// }

const domainMaxBuilder: (values: PerspectiveDashGenres[]) => (maxValue: number) => number =
  // (values: TimescopeDashValues[]) => (maxValue: number) => pipe((vals: TimescopeDashValues[]) => vals.map(v => v.group), reduce(max, -Infinity))(values), 
  (values: PerspectiveDashGenres[]) => (maxValue: number) => Math.ceil(pipe<PerspectiveDashGenres[], number[], number>(pluck('group'), reduce(max, -Infinity))(values))

const decimalToHrsMins = (value: number) => `${Math.floor(value)}:${Math.floor((value % 1) * 60).toString().padStart(2, '0')}`

type GenreChartProps = RouteComponentProps & {
  pathParams: TPathParams,
  genres: PerspectiveDashGenres[]
  height?: any
}

const GenresChart: React.SFC<GenreChartProps> = ({pathParams, genres, history, height = 70}) =>
  <ResponsiveContainer width='100%' height={(height * genres.length) + 90}>
    <BarChart layout='vertical' data={genres} onClick={navigateToGenre(history, pathParams)}>
      {/* <CartesianGrid stroke='#999'/> */}
      {/* <BarXAxisPersonal/>
      <BarXAxisGroup/> */}
      <XAxis height={40} type='number' stroke={BRAND_PERSONAL_COLOR} orientation='top' xAxisId='top' tickFormatter={decimalToHrsMins} domain={[0, domainMaxBuilder(genres)]}>
        <Label position='insideTopLeft' offset={0} stroke={BRAND_PERSONAL_COLOR}>hours by you</Label>
      </XAxis>
      {/* <XAxis height={40} type='number' stroke={BRAND_GLOBAL_COLOR} orientation='bottom' xAxisId='bottom' tickFormatter={decimalToHrsMins} domain={[0, domainMaxBuilder(genres)]}>
        <Label position='insideBottomLeft' offset={0} stroke={BRAND_GLOBAL_COLOR}>hours by soundpruf</Label>
      </XAxis> */}
      <YAxis width={136} type='category' stroke={BRAND_PERSONAL_COLOR} interval={0}
        tick={({payload, ...props}) => <CustomTick {...props} pathParams={pathParams} genre={genres[payload.value].genre}/>}
        />
      <Tooltip cursor={{fill: '#666'}} content={() => <div/>}/>
      {/* <Legend /> */}
      <Bar dataKey='personal' fill={BRAND_PERSONAL_COLOR} xAxisId='top' cursor='pointer'/>
      <Bar dataKey='group' fill={BRAND_GLOBAL_COLOR} xAxisId='top' cursor='pointer'/>
    </BarChart>
  </ResponsiveContainer>

const GenresChartWithRouter = withRouter(GenresChart)

export const GenresChartBlock: React.SFC<{pathParams: TPathParams, genres: PerspectiveDashGenres[], height?: any}> = ({children, ...params}) =>
  <div>
    {children}
    { params.genres.length > 0 ?
      <GenresChartWithRouter {...params}/> :
      <Comment>I don't see any genres for you here.  Have you <a target='new' href='http://open.spotify.com'>listened to Spotify lately?</a></Comment>
    }
  </div>
