import * as React from 'react';
import { ArtistListElement } from './ArtistListElement'

export interface TopFiveTimePeriodProps {
    artistArray: any
}

export const TopFiveTimePeriod: React.SFC<TopFiveTimePeriodProps> = ({ artistArray }) => {
    return (
        <div className="TopFiveTimePeriod">
            {
                artistArray.map((artist: any) => {
                    return (
                        <ArtistListElement artist={artist} />
                    )
                })
            }
        </div>
    );
}