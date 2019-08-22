import * as React from 'react'
import { useState } from 'react';
import styled from 'styled-components';
import { AchievementData } from '../../Home/Authed/Authed';
import { hrsAndMins } from '../../../lib/durationFormats';
import { AchievementListItem } from './AchievementListItem'
import { HeaderFlexDiv } from '../Elements'
import * as _ from 'lodash'
import { parseAchievementsByPeriod } from './achievements-utils';



const ListStyle = styled.ul`
    padding: 0;
    counter-reset: index;  
    overflow: visible;


li + li {
    /* border-top: 1px solid rgba(255,255,255,0.2); */
    }

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



export const UserAchievementsList: React.SFC<UserAchievementsListProps> = ({ userId, usersTopArtistByPeriodData }) => {

    const {
        dailyAchievements,
        weeklyAchievements,
        monthlyAchievements,
        lifetimeAchievements,
    } = parseAchievementsByPeriod(usersTopArtistByPeriodData, userId)


    // const { dayAndWeekDiff,
    //     weekAndMonthDiff,
    //     monthAndLifeDiff } = diffAchievementsByPeriod

    const [wasClicked, setClicked] = useState(false)
    const handleClick = () => setClicked(wasClicked => !wasClicked)


    const la: any = (lifetimeAchievements && lifetimeAchievements.length) ? lifetimeAchievements.slice(0, 3).map(({artistData, achievement}: any) => {

        let total: any = hrsAndMins(achievement.total)
        achievement.formattedTotal = total

        return {artistData, achievement}
    }) : []


    const ma: any = (monthlyAchievements && monthlyAchievements.length) ? monthlyAchievements.slice(0, 3).map(({artistData, achievement}: any) => {

        let total: any = hrsAndMins(achievement.total)
        achievement.formattedTotal = total

        return {artistData, achievement}
    }) : []

    const wa: any = (weeklyAchievements && weeklyAchievements.length) ? weeklyAchievements.slice(0, 3).map(({artistData, achievement}: any) => {
    console.log('TCL: wa:any -> achievement', achievement)

        let total: any = hrsAndMins(achievement.total)
        achievement.formattedTotal = total

        return {artistData, achievement}
    }) : []


    const da: any = (dailyAchievements && dailyAchievements.length) ? dailyAchievements.slice(0, 3).map(({artistData, achievement}: any) => {

        let total: any = hrsAndMins(achievement.total)
        achievement.formattedTotal = total

        return {artistData, achievement}
    }) : []



    return (
        <ListWrap>
            <HeaderFlexDiv><img src='/icons/award.svg' /> <h4>Achievements</h4></HeaderFlexDiv>
            <ListStyle>


                {la.length ? <AchievementListItem achievementTotal={lifetimeAchievements.length} achievements={la} title='LifeTime ' wasClicked={wasClicked} handleClick={handleClick} /> : null}


                {ma.length ? <AchievementListItem achievementTotal={monthlyAchievements.length} achievements={ma} title='This Month' wasClicked={wasClicked} handleClick={handleClick} /> : null}


                {wa.length ? <AchievementListItem achievementTotal={weeklyAchievements.length} achievements={wa} title='This Week' wasClicked={wasClicked} handleClick={handleClick} /> : null}


                {da.length ? <AchievementListItem achievementTotal={dailyAchievements.length} achievements={da} title='Today' wasClicked={wasClicked} handleClick={handleClick} /> : null}


            </ListStyle>
        </ListWrap>
    );
}
