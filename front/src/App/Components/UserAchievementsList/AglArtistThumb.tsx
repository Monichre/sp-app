import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User } from '../../../../../back/src/fns/graphql/types';
import { ArtistsFragmentArtist } from '../../../types';
import { hrsAndMins } from '../../../lib/durationFormats';
import { useSpring, animated } from 'react-spring';
import { ArtistAvatarDiv, ArtistNameDiv } from '../Elements';

export interface AglArtistThumbProps {
    achievement: {
        artist: ArtistsFragmentArtist
        fk: string
        pk: string
        sk: string
        total: number
        user: User
    }
}

export const AglArtistThumb: React.SFC<AglArtistThumbProps> = ({ achievement }) => {
    let [loaded, setLoaded] = useState(false)
    const { artist, fk, pk, sk, total, user } = achievement
    const { hrs, mins } = hrsAndMins(total)
    const ttl = loaded ? useSpring({ total: mins, from: { total: 0 } }) : { total: 0 }

    useEffect(() => setLoaded(loaded => !loaded))

    return (
        <div style={{ margin: '10px 10px 0', position: 'relative', padding: '10px 10px 0' }}>
            <ArtistAvatarDiv src={artist.images[0].url} />
            <ArtistNameDiv>{artist.name}</ArtistNameDiv>
            <p><animated.span>{ttl.total}</animated.span> minutes</p>
        </div>
    )
}


