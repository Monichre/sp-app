import React, { useState, useContext, useEffect, useMemo } from "react";
import { Link } from 'react-router-dom';
import { Text } from 'recharts';
import { UserAchievementContext } from '../../../../Authed/Authed'
import { hrsAndMins, decimalToHrsMins } from '../../../../../../lib/durationFormats'
import { comparePersonalAndGroupScore } from '../../../../../Components/UserAchievementsList/achievements-utils'
import { normalizeTimeScope } from '../../../../Authed/Insights/Main/Overview'
import 'antd/es/popover/style/css'
import 'antd/es/list/style/css'
import 'antd/es/avatar/style/css'
import { ListStyle } from '../../../../../Components/ListStyle';
import { PopOverStyle } from '../../../../../Components/PopOver';
import { AvatarStyle } from '../../../../../Components/Avatar';
import { TickProps } from './ArtistsChart';
import { suspensefulHook } from '../../../../../../lib/suspensefulHook';
import { useGetArtistAchievementHolders } from '../../../../../../types';
import { useFetchAchievementHolders } from '../../Hooks/hooks';
import { AchievementHoldersList } from '../../../../../Components/ArtistAchievementHolders/AchievementHoldersList';

const firstPlaceBadge: any = '/icons/first-currentUser.png'
const secondPlaceBadge = '/icons/second-currentUser.png'
const thirdPlaceBadge = '/icons/third.svg'

export const badgeMap: any = {
    0: firstPlaceBadge,
    1: secondPlaceBadge,
    2: thirdPlaceBadge
}


const TopListenerLink: any = ({ className, handleClick, children }: any) => (

    <Link to='#' className={className} style={{
        position: 'relative'
    }} onClick={handleClick}>
        {children}
        <clipPath id='clipCircle2'>
            <circle r='16px' cx='16px' cy='16px' />
        </clipPath>

    </Link>

)



const AchievementHoldersPopUp: React.SFC<any> = ({ x, y, artist, pathParams, totalTimeListened,
    groupScore, visible, handleClick }) => {
    

    // Context Props
    const { topArtistsWithAchievementHolders } = useContext(UserAchievementContext)
    console.log('TCL: topArtistsWithAchievementHolders', topArtistsWithAchievementHolders)
    const { currentUser } = useContext(UserAchievementContext)

    console.count('AchievementHoldersPopUp render')

    // {artist: currentArtist=false, achievementHolders=false}
    const { artist:currentArtist=false, achievementHolders=false } = topArtistsWithAchievementHolders.find((awa: any) => {
        return awa && awa.artist && artist ? awa.artist.id === artist.id : false
    })

    console.log('TCL: currentArtist', currentArtist)

    const { day = null, week = null, month = null, life = null } = achievementHolders

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
    console.log('TCL: ah', ah)
    
    for(let holder in ah) {
        if(!ah[holder]) {
            delete ah[holder]
        }
    }


    const { total, status } = comparePersonalAndGroupScore(totalTimeListened, groupScore)

    const currentUserIsTopListener: any = status
    // const currentUserIsSecond: any = second && second.user ? second.user.uid === userId : false
    // const secondPlaceExists: any = second && second.user 

    // const topListenerHandle: any = first && first.user.displayName ? first.user.displayName : first && first.user.email ? first.user.email : null
    // const secondListenerHandle: any = second && second.user.displayName ? second.user.displayName : second && second.user.email ? second.user.email : null
    // const currentUserIsSecond: any = second && second.user ? second.user.uid === userId : false
    // const secondPlaceExists: any = second && second.user 

    // const topListenerHandle: any = first && first.user.displayName ? first.user.displayName : first && first.user.email ? first.user.email : null
    // const secondListenerHandle: any = second && second.user.displayName ? second.user.displayName : second && second.user.email ? second.user.email : null

    /*

    first && first.user.photoURL ? <image href={first.user.photoURL} width='32px' height='32px' clipPath='url(#clipCircle2)' transform={`translate(${(x || 0) + 15}, ${(y || 0) - 20})`} /> : first ? <Text stroke='#64d6ee' width={100} font-size="10" height={20} textAnchor='end' dx={-78} dy={24} {...{ x, y }}>
        {topListenerHandle}

        first && first.user.photoURL ? <image href={first.user.photoURL} width='32px' height='32px' clipPath='url(#clipCircle2)' transform={`translate(${(x || 0) + 15}, ${(y || 0) - 20})`} /> : first ? <Text stroke='#64d6ee' width={100} font-size="10" height={20} textAnchor='end' dx={-78} dy={24} {...{ x, y }}>
        {topListenerHandle}

    */


    // const secondSpot: any = secondPlaceExists && !currentUserIsSecond ? <image href={secondPlaceBadge} transform={`translate(${(x || 0) + 45}, ${(y || 0) - 20})`} width='30px' height='30px'
    //             /> : second && second.user.photoURL ? <image href={second.user.photoURL} width='32px' height='32px' clipPath='url(#clipCircle2)' transform={`translate(${(x || 0) + 45}, ${(y || 0) - 20})`} /> : second && second.user ? <Text stroke='#64d6ee' width={100} font-size="10" height={20} textAnchor='end' dx={-78} dy={24} {...{ x, y }}>
    //                 {secondListenerHandle}
    //             </Text> : null


    const title: any = normalizeTimeScope(pathParams)

    const topSpot: any = currentUserIsTopListener ? <image href={firstPlaceBadge} transform={`translate(${(x || 0) + 15}, ${(y || 0) - 20})`} width='30px' height='30px'
    /> : null
    const badgePlacement = topSpot ? topSpot : null

    const content = <AchievementHoldersList {...{ currentUser, artist, pathParams }} style={{
        background: '#030616!important'
    }} />

    console.count('AchievementHolder PopUp Rendered:')


    return (

        <PopOverStyle placement="topLeft" content={content} title={title} trigger="click"
            visible={visible} style={{
                background: '#030616!important'
            }}>
            <TopListenerLink handleClick={handleClick}>
                {badgePlacement}
            </TopListenerLink>
        </PopOverStyle>

    );
}

export const TopListenerYaxis: React.SFC<TickProps & any> = ({ x, y, offset, artist, pathParams, userId, totalTimeListened, groupScore }) => {

    const [visible, setVisible] = useState(false)
    const handleClick = () => setVisible(visible => !visible)
    console.count('TopListenerYaxis render')



    return <AchievementHoldersPopUp {...{ x, y, offset, artist, pathParams, userId, totalTimeListened, groupScore, visible, handleClick }} />

}
