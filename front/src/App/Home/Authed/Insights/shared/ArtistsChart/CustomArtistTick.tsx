import * as React from 'react';
// import { TickProps } from './ArtistsChart';
import {  artistLink } from '../functions';
import { Link } from 'react-router-dom';
import { Text } from 'recharts';
import withSizes from 'react-sizes'
import {mapSizesToProps} from '../../../../../../lib/mapSizes'


const ArtistTick: React.SFC<any> = React.memo(({ x, y, offset, artist, pathParams, isMobile }) => {
    
    const circleClipPath = isMobile ? '16px' : '32px'
    const imageDim = isMobile ? '32px' : '62px'
    const textSize = isMobile ? '10' : '14'
    const translateXVal = isMobile ? 40 : 70
    const translateYVal = isMobile ? 16 : 32


    const ArtistLink: any = ({ className }: any) => (

        <Link to={artistLink(pathParams, artist.id)} className={className} style={{
            position: 'relative'
        }}>

            <clipPath id='clipCircle'>
                <circle r={circleClipPath} cx={circleClipPath} cy={circleClipPath} />
            </clipPath>
            {!isMobile ? <Text stroke='white' width={50} style={{
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
                wordBreak: 'break-all',
                hyphens: 'auto'
            }} font-size={textSize} textAnchor='end' dx={-78} dy={4} {...{ x, y }}>
                {artist.name}
            </Text> : null}

            <image href={artist.images[0] && artist.images[0].url} width={imageDim} height={imageDim} clipPath='url(#clipCircle)' transform={`translate(${(x || 0) - translateXVal},${(y || 0) - translateYVal})`}
            />
        </Link>

    )


    return <ArtistLink className={`${artist.name.length > 1 ? artist.name.split(' ').join('-').toLowerCase() : artist.name.toLowerCase()}`} />
})

export const CustomArtistTick: any = withSizes(mapSizesToProps)(ArtistTick)
