import * as React from 'react'
import { useState } from 'react';
import styled from 'styled-components';
import { AchievementData } from '../../Home/Authed/Authed';
import { hrsAndMins } from '../../../lib/durationFormats';
import { useGetUserAchievements } from '../../../types';
import { suspensefulHook } from '../../../lib/suspensefulHook';
import { AchievementListItem } from './AchievementListItem'
import { HeaderFlexDiv } from '../Elements';
import moment from 'moment'


const ListStyle = styled.ul`
    padding: 0 .5rem;
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
    position: fixed;
    left: 0;
    top: 30vh;
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




export const UserAchievementsList: React.SFC<UserAchievementsListProps> = ({ userId }) => {



    const [wasClicked, setClicked] = useState(false)
    const handleClick = () => setClicked(wasClicked => !wasClicked)
    const day = moment().format('YYYY-MM-DD')
    const week = `${moment().year()}-${moment().week()}`
    const month = `${moment().year()}-${moment().month()}`

    const topsBitch: any = {

        day: {
            first: {

                pk: `topListener#first#day#${day}`,
                fk: `${userId}#topListener#first`,
            },
            second: {
                pk: `topListener#second#day#${day}`,
                fk: `${userId}#topListener#second`,

            },
            third: {
                pk: `topListener#third#day#${day}`,
                fk: `${userId}#topListener#third`,
            }
        },
        week: {
            first: {

                pk: `topListener#first#week#${week}`,
                fk: `${userId}#topListener#first`,
            },
            second: {
                pk: `topListener#second#week#${week}`,
                fk: `${userId}#topListener#second`,

            },
            third: {
                pk: `topListener#third#week#${week}`,
                fk: `${userId}#topListener#third`,
            }
        },
        month: {
            first: {

                pk: `topListener#first#month#${month}`,
                fk: `${userId}#topListener#first`,
            },
            second: {
                pk: `topListener#second#month#${month}`,
                fk: `${userId}#topListener#second`,

            },
            third: {
                pk: `topListener#third#month#${month}`,
                fk: `${userId}#topListener#third`,
            }
        },
        life: {
            first: {

                pk: `topListener#first#life#life`,
                fk: `${userId}#topListener#first`,
            },
            second: {
                pk: `topListener#second#life#life`,
                fk: `${userId}#topListener#second`,

            },
            third: {
                pk: `topListener#third#life#life`,
                fk: `${userId}#topListener#third`,
            }
        }
    }


    const lifeTimeAchievementData: any = suspensefulHook(useGetUserAchievements({ variables: { pk: topsBitch.life.first.pk, fk: topsBitch.life.first.fk }, suspend: true, pollInterval: 15000 }))

    const { getUserAchievements: lifetimeAchievements }: any = lifeTimeAchievementData



    const monthlyAchievementData: any = suspensefulHook(useGetUserAchievements({ variables: { pk: topsBitch.week.first.pk, fk: topsBitch.week.first.fk }, suspend: true, pollInterval: 15000 }))

    const { getUserAchievements: monthlyAchievements }: any = monthlyAchievementData



    const weeklyAchievementData: any = suspensefulHook(useGetUserAchievements({ variables: { pk: topsBitch.week.first.pk, fk: topsBitch.week.first.fk }, suspend: true, pollInterval: 15000 }))

    const { getUserAchievements: weeklyAchievements }: any = weeklyAchievementData



    const dailyAchievementData: any = suspensefulHook(useGetUserAchievements({ variables: { pk: topsBitch.week.first.pk, fk: topsBitch.week.first.fk }, suspend: true, pollInterval: 15000 }))

    const { getUserAchievements: dailyAchievements }: any = dailyAchievementData


    

    const la: any = (lifetimeAchievements && lifetimeAchievements.length) ? lifetimeAchievements.map((achievement: any) => {

        let total: any = hrsAndMins(achievement.total)
        achievement.formattedTotal = total

        return achievement
    }) : []


    const ma: any = (monthlyAchievementData && monthlyAchievementData.length) ? monthlyAchievementData.map((achievement: any) => {

        let total: any = hrsAndMins(achievement.total)
        achievement.formattedTotal = total

        return achievement
    }) : []

    const wa: any = (weeklyAchievements && weeklyAchievements.length) ? weeklyAchievements.map((achievement: any) => {

        let total: any = hrsAndMins(achievement.total)
        achievement.formattedTotal = total

        return achievement
    }) : []


    const da: any = (dailyAchievements && dailyAchievements.length) ? dailyAchievements.map((achievement: any) => {

        let total: any = hrsAndMins(achievement.total)
        achievement.formattedTotal = total

        return achievement
    }) : []


    return (
        <ListWrap>
            <HeaderFlexDiv><img src='/icons/award.svg' /> <h4>Achievements</h4></HeaderFlexDiv>
            <ListStyle>


                {la.length ? <AchievementListItem achievements={la} title='LifeTime ' wasClicked={wasClicked} handleClick={handleClick} /> : null}


                {ma.length ? <AchievementListItem achievements={ma} title='This Month' wasClicked={wasClicked} handleClick={handleClick} /> : null}


                {wa.length ? <AchievementListItem achievements={wa} title='This Week' wasClicked={wasClicked} handleClick={handleClick} /> : null}


                {da.length ? <AchievementListItem achievements={da} title='Today' wasClicked={wasClicked} handleClick={handleClick} /> : null}


            </ListStyle>
        </ListWrap>
    );
}
