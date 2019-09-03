import * as React from 'react';
import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { User } from '../../../../../back/src/fns/graphql/types';
import { ArtistsFragmentArtist } from '../../../types';
import { hrsAndMins } from '../../../lib/durationFormats';
import { AvatarBg, ArtistNameDiv, FlexDiv, firstPlaceBadge } from '../Elements';
import { Tree, Title } from '../Tree';


const ListItem: any = styled.li`
    display: flex;
    overflow: visible;
    align-items: center;
    align-content: center;
    padding: 12px 0;
    width: 100%;
    position: relative;
    color: #fff;
    cursor: pointer;


&::before {
  /* content: counters(index, ".", decimal-leading-zero); */
  content: attr(data-total);
  font-size: 1.5rem;
  text-align: right;
  font-weight: bold;
  min-width: 50px;
  padding-right: 12px;
  font-variant-numeric: tabular-nums;
  align-self: center;
  background-image: linear-gradient(to bottom, aquamarine, orangered);
  background-attachment: fixed;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
`


export const ArtistThumbPrev = styled.div`
    position: relative;
    padding: 5px;
    overflow: visible;
    margin-top: 40px;

    &:nth-child(1) {
        margin-top: 20px;
    }

    p {
        position: absolute;
        width: max-content;
        bottom: -30px;
        right: -49px;
        color: rgb(100, 214, 238)!important;
    }
`

export interface AchievementListItemProps {
    title: string
    achievements: any[]
    // wasClicked: boolean
    handleClick: Function
    achievementTotal: number
}



export const AchievementListItem: React.SFC<AchievementListItemProps> = ({ title, achievements, achievementTotal, handleClick }) => {
    return (
        <ListItem data-total={achievementTotal} onClick={handleClick}>
            <Title>
                {title}
            </Title>
            <AvatarBg tiny={true} src={firstPlaceBadge} />
    </ListItem>
    );
}



