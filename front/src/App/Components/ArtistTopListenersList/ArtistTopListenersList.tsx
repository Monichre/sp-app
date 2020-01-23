import * as React from 'react';
import { hrsAndMins } from '../../../lib/durationFormats';
import { Box } from 'rebass';
import { Badge } from 'antd';
import { badgeMap } from '../../Home/Authed/Insights/shared/ArtistsChart/TopListenerYAxis';
import { AvatarBg } from '../Elements';

export interface ArtistTopListenersListProps {
    listeners: any,
    place: any
}

export const ArtistTopListenersList: React.SFC<ArtistTopListenersListProps> = ({ listeners, place }) => {
    return (
        <div style={{}}>
            {
              listeners.map((listener: any) => {
              const { user } = listener
              const { hrs, mins } = hrsAndMins(listener.total)
              const hours = hrs ? `${hrs} hours & ` : ''
              const minutes = mins ? `${mins} mins` : ''
              const ttl = `${hours}${minutes}`
              
              if(!user) {
                return <div></div>
              }

              return (
                <Box mt={45}>
                  
                <Badge count={<img src={badgeMap[place]}
                  style={{
                    height: '30px',
                    width: '30px',
                    zIndex: 2,
                    left: '40%'
                  }} />}>
                    <AvatarBg artistPage style={{
                      marginTop: '0.5rem'
                    }}>
                      <img src={user.photoURL} />
                    </AvatarBg>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <h4 style={{ color: '#fff', position: 'relative', zIndex: 2, textTransform: 'capitalize' }}>{place} place all time top listener <br /> {user.displayName}</h4>
                    <p style={{ position: 'relative', zIndex: 2 }}><b>{ttl}</b></p>
                  </Badge>
                </Box>
              )
            })}
        </div>
    );
}