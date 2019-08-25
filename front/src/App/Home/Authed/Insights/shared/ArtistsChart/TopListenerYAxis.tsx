import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { Text } from 'recharts';
import { UserAchievementContext } from '../../../../Authed/Authed'
import { hrsAndMins, decimalToHrsMins } from '../../../../../../lib/durationFormats'
import {comparePersonalAndGroupScore} from '../../../../../Components/UserAchievementsList/achievements-utils'
import { Popover, List, Avatar } from 'antd';
import 'antd/es/popover/style/css'
import 'antd/es/list/style/css'
import 'antd/es/avatar/style/css'
import { ListStyle } from '../../../../../Components/ListStyle';
import { PopOverStyle } from '../../../../../Components/PopOver';
import { AvatarStyle } from '../../../../../Components/Avatar';
import { TickProps } from './ArtistsChart';


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





export const TopListenerYaxis: React.SFC<TickProps & any> = React.memo(({ x, y, offset, artist, pathParams, userId, totalTimeListened, groupScore }) => {

    let [visible, setVisible] = useState(false)

    const handleClick = () => setVisible(visible => !visible)

    const { topListeners } = artist
    const { timeScope, perspective }: any = pathParams
    console.log('TCL: pathParams', pathParams)
    const { day, week, month, life } = topListeners
    const { achievements, currentUser } = useContext(UserAchievementContext)
    const {total, status} = comparePersonalAndGroupScore(totalTimeListened, groupScore)

    const normalizetimeScopeMap: any = {
        thisWeek: {
            title: 'This Week',
            data: week
        },
        thisMonth: {
            title: 'This Month',
            data: month
        },
        lifetime: {
            title: 'Life Time',
            data: life
        },

    }

    

    const { title=false, data=null } = normalizetimeScopeMap[timeScope]
    const { first, second, third } = data ? data : {
        first: null,
        second: null,
        third: null
    }
    const listeners = [first, second, third].filter(Boolean)
    
    const currentUserIsTopListener: any = status
    const currentUserIsSecond: any = second && second.user ? second.user.uid === userId : false
    const secondPlaceExists: any = second && second.user 

    const topListenerHandle: any = first && first.user.displayName ? first.user.displayName : first && first.user.email ? first.user.email : null
    const secondListenerHandle: any = second && second.user.displayName ? second.user.displayName : second && second.user.email ? second.user.email : null
    const firstPlaceBadge: any = '/icons/first-currentUser.png'
    const secondPlaceBadge = '/icons/second-currentUser.png'
    const thirdPlaceBadge = '/icons/third.svg'

    const badgeMap: any = {
        0: firstPlaceBadge,
        1: secondPlaceBadge,
        2: thirdPlaceBadge
    }



    const ToolTipListeners = <ListStyle>
        <List itemLayout="horizontal">
            {listeners.length ? listeners.map((listener: any, index: number) => {
                return (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<AvatarStyle><Avatar size='large' src={listener && listener.user.photoURL ? listener.user.photoURL : badgeMap[index]} /> </AvatarStyle>}
                            title={listener ? listener.user.displayName : ''}
                            description={listener && listener.user.uid === userId ? `${decimalToHrsMins(totalTimeListened)}` : ''}
                        />
                    </List.Item>
                )
            }) : null}
        </List>
    </ListStyle>

    const topSpot: any = currentUserIsTopListener ? <image href={firstPlaceBadge} transform={`translate(${(x || 0) + 15}, ${(y || 0) - 20})`} width='30px' height='30px'
    /> : first && first.user.photoURL ? <image href={first.user.photoURL} width='32px' height='32px' clipPath='url(#clipCircle2)' transform={`translate(${(x || 0) + 15}, ${(y || 0) - 20})`} /> : first ? <Text stroke='#64d6ee' width={100} font-size="10" height={20} textAnchor='end' dx={-78} dy={24} {...{ x, y }}>
        {topListenerHandle}
    </Text> : null


const secondSpot: any = secondPlaceExists && !currentUserIsSecond ? <image href={secondPlaceBadge} transform={`translate(${(x || 0) + 45}, ${(y || 0) - 20})`} width='30px' height='30px'
            /> : second && second.user.photoURL ? <image href={second.user.photoURL} width='32px' height='32px' clipPath='url(#clipCircle2)' transform={`translate(${(x || 0) + 45}, ${(y || 0) - 20})`} /> : second && second.user ? <Text stroke='#64d6ee' width={100} font-size="10" height={20} textAnchor='end' dx={-78} dy={24} {...{ x, y }}>
                {secondListenerHandle}
            </Text> : null

const badgePlacement = topSpot ? topSpot : secondSpot



    return (
        <PopOverStyle>
            <Popover placement="topLeft" content={ToolTipListeners} title="Top Listeners" trigger="click"
                visible={visible}>
                <TopListenerLink handleClick={handleClick} className={`${artist.name.length > 1 ? artist.name.split(' ').join('-').toLowerCase() : artist.name.toLowerCase()} ${currentUserIsTopListener ? 'currentUserIsTopListener' : ''}`}>
                    {badgePlacement}
                </TopListenerLink>
            </Popover>
        </PopOverStyle>
    )
})

