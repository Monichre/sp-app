import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { Achievement } from '../../../../back/src/shared/tables/TableAchievement';

const ListItem = styled.li`

    display: flex;
    align-items: center;
    padding: 12px 0;
    box-sizing: border-box;
    counter-increment: index; 


&::before {
  content: counters(index, ".", decimal-leading-zero);
  font-size: 1.5rem;
  text-align: right;
  font-weight: bold;
  min-width: 50px;
  padding-right: 12px;
  font-variant-numeric: tabular-nums;
  align-self: flex-start;
  background-image: linear-gradient(to bottom, aquamarine, orangered);
  background-attachment: fixed;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
`

const ListStyle = styled.ul`
    padding: 0 1.5rem;
    counter-reset: index;  


li + li {
    /* border-top: 1px solid rgba(255,255,255,0.2); */
    }

`

const ListWrap = styled.div`

margin-top: 80px;

  h4 {
        
  
  
      border-top: 1px solid rgba(255,255,255,.1);
      border-bottom: 1px solid rgba(255,255,255,.1);
    background-color: rgba(216,216,216,.05);
    color: #fff;
    width: 100%;
    padding: 1.5rem 0rem;
    text-align: center;
    margin: 0!important;
    font-size: 1.25rem;
    
  }
  
`


export interface AchievementItemProps {
    achievement: Achievement
}

const AchievementItem: React.SFC<AchievementItemProps> = ({ achievement }) => {
    return (<ListItem>

    </ListItem>);
}

export default AchievementItem;

export interface UserAchievementsListProps {

}

export const UserAchievementsList: React.SFC<UserAchievementsListProps> = () => {
    return (
        <ListWrap>
            <h4> <img src='/icons/award.svg' /> Achievements</h4>
            <ListStyle>
                <ListItem>Lorem dolor amet sit </ListItem>
                <ListItem>Lorem ipsum dolor sit amet consecutor adipiscingLorem ipsum dolor sit amet </ListItem>
                <ListItem>Lorem ipsum dolor sit amet consecutor</ListItem>
                <ListItem>Lorem dolor amet sit </ListItem>
            </ListStyle>
        </ListWrap>
    );
}


