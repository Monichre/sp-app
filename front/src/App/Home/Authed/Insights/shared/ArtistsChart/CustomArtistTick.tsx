import * as React from 'react';
import { Component } from 'react';
import { TickProps } from './ArtistsChart';
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
import { hrsAndMins, decimalToHrsMins } from '../../../../../../lib/durationFormats'
import { TopListenerYaxis } from './TopListenerYAxis'



export const CustomArtistTick: React.SFC<TickProps> = React.memo(({ x, y, offset, artist, pathParams }) => {


    const ArtistLink: any = ({ className }: any) => (

        <Link to={artistLink(pathParams, artist.id)} className={className} style={{
            position: 'relative'
        }}>

            <clipPath id='clipCircle'>
                <circle r='32px' cx='32px' cy='32px' />
            </clipPath>
            <Text stroke='white' width={50} style={{
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
                wordBreak: 'break-all',
                hyphens: 'auto'
            }} font-size="14" textAnchor='end' dx={-78} dy={4} {...{ x, y }}>
                {artist.name}
            </Text>

            <image href={artist.images[0] && artist.images[0].url} width='64px' height='64px' clipPath='url(#clipCircle)' transform={`translate(${(x || 0) - 70},${(y || 0) - 32})`}
            />
        </Link>

    )


    return <ArtistLink className={`${artist.name.length > 1 ? artist.name.split(' ').join('-').toLowerCase() : artist.name.toLowerCase()}`} />
})
