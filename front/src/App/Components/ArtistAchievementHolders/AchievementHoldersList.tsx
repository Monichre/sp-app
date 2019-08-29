import * as React from 'react';
import { ArtistsFragmentArtist, useGetArtistAchievementHolders } from '../../../types';
import { User } from '../../../../../back/src/fns/graphql/types';
import { suspensefulHook } from '../../../lib/suspensefulHook';
import { ListStyle } from '../ListStyle';
import { AvatarStyle } from '../Avatar';
import { decimalToHrsMins, hrsAndMins } from '../../../lib/durationFormats';
import { Popover, List, Avatar } from 'antd';
import 'antd/es/popover/style/css'
import 'antd/es/list/style/css'
import 'antd/es/avatar/style/css'
import { badgeMap } from '../../Home/Authed/Insights/shared/ArtistsChart/TopListenerYAxis';





export interface AchievementHoldersListProps {
    artist: ArtistsFragmentArtist
    currentUser: User
    pathParams: any
    style: any
}
 
export const AchievementHoldersList: React.SFC<AchievementHoldersListProps> = ({ artist, style, currentUser, pathParams }) => {
    const { getArtistAchievementHolders = null }: any = suspensefulHook(useGetArtistAchievementHolders({ variables: { perspectiveUID: 'global', artistId: artist.id }, suspend: true }))
    
    const { day = null, week = null, month = null, life = null } = getArtistAchievementHolders
    const { timeScope }: any = pathParams

    const achievementHolderTimeScopeMap: any = {
        today: day ? day : null,
        thisWeek: week ? week : null,
        thisMonth: month ? month : null,
        lifetime: life ? life : null
    }

    const perspectiveAchievementHolders = Object.assign({}, achievementHolderTimeScopeMap[timeScope])
    console.log('TCL: perspectiveAchievementHolders', perspectiveAchievementHolders)

    for (let place in perspectiveAchievementHolders) {
        if (!perspectiveAchievementHolders[place].user) {
            perspectiveAchievementHolders[place] = null
        }
    }
    

    const ah = Object.assign({}, perspectiveAchievementHolders)
    for(let holder in ah) {
        if(!ah[holder]) {
            delete ah[holder]
        }
    }
 
    return ( 

        <ListStyle {...{style}}>
        <List itemLayout="horizontal">
            {
                    Object.keys(ah).length ? Object.keys(ah).map((holder: any, index: number) => {
                        const listener = ah[holder]
                        const { total } = listener
                        const {hrs=false, mins} = hrsAndMins(total)
                        return (
                            <List.Item>
                            <List.Item.Meta
                                avatar={<AvatarStyle><Avatar size='large' src={listener && listener.user.photoURL ? listener.user.photoURL : badgeMap[index]} /> </AvatarStyle>}
                                title={listener ? listener.user.displayName : ''}
                                description={`${ hrs ? `${hrs} hours` : ''} ${mins} mins`}
                            />
                        </List.Item> 
                    )
                }) : null 
            }

        </List>
    </ListStyle>
     );
}
 


