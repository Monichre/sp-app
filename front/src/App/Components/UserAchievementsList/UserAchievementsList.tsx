import * as React from 'react'
import { useState, useRef, useEffect, memo } from 'react';
import { useSpring, animated, useTransition, useChain, config  } from 'react-spring'
import styled, { css} from 'styled-components';
import { Achievement } from '../../../../../back/src/shared/tables/TableAchievement';
import { AchievementsState, AchievementData } from '../../Home/Authed/Authed';
import { hrsAndMinsAndSecs, hrsAndMins } from '../../../lib/durationFormats';
import { useGetUserAchievements } from '../../../types';
import { suspensefulHook } from '../../../lib/suspensefulHook';
import { AchievementListItem} from './AchievementListItem'
import { ArtistAvatarDiv, ArtistNameDiv, HeaderFlexDiv } from '../Elements';

// import { Collapse } from 'antd';
// import 'antd/es/collapse/style/css'

// const { Panel } = Collapse;



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

    

    const topsBitch = {
        first: {
            pk: `global#artist#life#life#topListener#first`,
            fk: `#topListener#first#${userId}`,
        },
        second: {
            pk: `global#artist#life#life#topListener#second`,
            fk: `#topListener#second#${userId}`,
        },
        third: {
            pk: `global#artist#life#life#topListener#third`,
            fk: `#topListener#third#${userId}`,
        }
    }
    
    const data: any = suspensefulHook(useGetUserAchievements({ variables: { pk: topsBitch.first.pk, fk: topsBitch.first.fk }, suspend: true, pollInterval: 15000 }))
    

    const { getUserAchievements }: any = data
    const achievements: any = (getUserAchievements && getUserAchievements.length) ? getUserAchievements.map((achievement: any) => {

        let total: any = hrsAndMins(achievement.total)
        achievement.formattedTotal = total

        return achievement
    }) : []

    const [firsts, seconds, thirds]: any = [achievements.filter((achievement: any) => achievement.pk === topsBitch.first.pk), achievements.filter((achievement: any) => achievement.pk === topsBitch.second.pk), achievements.filter((achievement: any) => achievement.pk === topsBitch.third.pk)]
    function callback (key: any) {
        console.log(key);
    }

    const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;


    return (
        <ListWrap>
            <HeaderFlexDiv><img src='/icons/award.svg' /> <h4>Achievements</h4></HeaderFlexDiv>
            <ListStyle>
                {firsts.length ? <AchievementListItem achievements={firsts} title='First' wasClicked={wasClicked} handleClick={handleClick} /> : null}
                {seconds.length ? <AchievementListItem achievements={seconds} title='Second' wasClicked={wasClicked} handleClick={handleClick} /> : null}
            </ListStyle>
        </ListWrap>
    );
}


// <Collapse defaultActiveKey={['1']} onChange={callback}>
//                 <Panel header="This is panel header 1" key="1">
//                     <p>{text}</p>
//                 </Panel>
//                 <Panel header="This is panel header 2" key="2">
//                     <p>{text}</p>
//                 </Panel>
//                 <Panel header="This is panel header 3" key="3" disabled>
//                     <p>{text}</p>
//                 </Panel>
//             </Collapse>