import * as React from 'react'
import styled from 'styled-components';
import { AchievementData, UserAchievementContext } from '../../Home/Authed/Authed';
import { decimalToHrsMins, DecimalHoursToMinutes } from '../../../lib/durationFormats';
import { AchievementListItem } from './AchievementListItem'
import { HeaderFlexDiv } from '../Elements'
import { parseAchievementsByPeriod } from './achievements-utils';
import * as _ from 'lodash'
import { mapSizesToProps } from '../../../lib/mapSizes'
import withSizes from 'react-sizes'


const ListStyle = styled.ul`
    padding: 0;
    counter-reset: index;  
    overflow: visible;

`

const ListWrap = styled.div`
.ant-collapse {
    border: none;
}
.ant-collapse-item {
    background-color: #030616;
    
    border-bottom: 1px solid rgba(255,255,255,.1);
}
.ant-collapse-header {
    color: #fff!important;
    > * {
        color: #fff!important;
    }
}
.ant-collapse-content-box {
    background-color: #030616;
    color: #fff;
}
    background-color: #030616;
    margin-top: 30px;
    width: 200px;
    overflow: visible;
    height: auto; 
    border-right: 1px solid rgba(255,255,255,.1);
    z-index: 20;

  h4 {
    color: #fff;
    padding: 0!important;
    text-align: center;
    margin: 0!important;
    font-size: 1.25rem;
  }
  
`

export interface UserAchievementsListProps {
    userId: string
    usersTopArtistByPeriodData: any
    children?: any
}



const extractAchievementTypeAndValue = (pk: any) => {
    const split = pk.split('#')
    const end = split.length - 1

    const achievementType = split[end - 1]
    const achievementValue = split[end]

    return {
        achievementType,
        achievementValue
    }
}


export interface AchievementItemProps {
    achievementData: AchievementData
    title: string,
    achievements: any[]
}


const UAL: React.SFC<any> = ({ userId, usersTopArtistByPeriodData, isMobile }) => {

    // Check browser memory for some notification shit I wanna do
    // @ts-ignore
    const achievementsFromMemory = JSON.parse(localStorage.getItem('userAchievements'))

    const {
        achievements
    } = parseAchievementsByPeriod(usersTopArtistByPeriodData, userId)
    const { setAchievements, isOpen, setSideBarOpen, appNotifications, setNotifications }: any = React.useContext(UserAchievementContext)
    const handleClick = () => setSideBarOpen((isOpen: boolean) => !isOpen)
    const {
        week: weeklyAchievements,
        month: monthlyAchievements,
        life: lifetimeAchievements,
    } = achievements


    const la: any = (lifetimeAchievements) ? lifetimeAchievements.slice(0, 3).map(({ artistData, achievement }: any) => {

        let total: DecimalHoursToMinutes = decimalToHrsMins(achievement.total)
        achievement.formattedTotal = total

        return { artistData, achievement }
    }) : []


    const ma: any = (monthlyAchievements) ? monthlyAchievements.slice(0, 3).map(({ artistData, achievement }: any) => {

        let total: DecimalHoursToMinutes = decimalToHrsMins(achievement.total)
        achievement.formattedTotal = total

        return { artistData, achievement }
    }) : []

    const wa: any = (weeklyAchievements) ? weeklyAchievements.slice(0, 3).map(({ artistData, achievement }: any) => {

        let total: DecimalHoursToMinutes = decimalToHrsMins(achievement.total)
        achievement.formattedTotal = total

        return { artistData, achievement }
    }) : []

    React.useEffect(() => {
        setAchievements(achievements)
    }, [])


    
    // React.useEffect(() => {
    //     if (achievementsFromMemory) {
    //         const weekDiff = Math.abs(achievementsFromMemory.week.length - weeklyAchievements.length)
    //         const monthDiff = Math.abs(achievementsFromMemory.month.length - monthlyAchievements.length)
    //         const lifeDiff = Math.abs(achievementsFromMemory.life.length - lifetimeAchievements.length)

    //         if (weekDiff > 0 || monthDiff > 0 || lifeDiff > 0) {
    //             alert('we have achievements from last login. Lets compare the latest')
    //             let total = weekDiff + monthDiff + lifeDiff

    //             const notificationData = {
    //                 total,
    //                 week: weekDiff,
    //                 month: monthDiff,
    //                 life: lifeDiff
    //             }

    //             setNotifications(notificationData)
    //         }
    //     } else {

    //         const notificationData = {
    //             total: weeklyAchievements.length + monthlyAchievements.length + lifetimeAchievements.length,
    //             week: weeklyAchievements.length,
    //             month: monthlyAchievements.length,
    //             life:  lifetimeAchievements.length
    //         }

    //         setNotifications(notificationData)
            
    //     }

    // }, [achievements.week, achievements.month, achievements.life])

    return isMobile ? null : (
        <ListWrap>
            <HeaderFlexDiv><h4>Badges</h4><img src='/icons/award.svg' style={{marginLeft: '8px'}} /></HeaderFlexDiv>
            <ListStyle>

                {la.length ? <AchievementListItem achievementTotal={lifetimeAchievements.length} achievements={la} title='LifeTime' handleClick={handleClick} /> : null}


                {ma.length ? <AchievementListItem achievementTotal={monthlyAchievements.length} achievements={ma} title='This Month' handleClick={handleClick} /> : null}


                {wa.length ? <AchievementListItem achievementTotal={weeklyAchievements.length} achievements={wa} title='This Week' handleClick={handleClick} /> : null}

            </ListStyle>
        </ListWrap>
    );
}


export const UserAchievementsList: any = withSizes(mapSizesToProps)(UAL)