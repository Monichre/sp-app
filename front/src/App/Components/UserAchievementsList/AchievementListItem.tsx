import * as React from 'react';
import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { User } from '../../../../../back/src/fns/graphql/types';
import { ArtistsFragmentArtist } from '../../../types';
import { hrsAndMins } from '../../../lib/durationFormats';
import { AvatarBg, ArtistNameDiv, FlexDiv } from '../Elements';
import { Tree } from '../Tree';


const ListItem: any = styled.li`
    display: flex;
    overflow: visible;
    align-items: center;
    align-content: center;
    padding: 12px 0;
    overflow-x: scroll;
    width: 100%;
    position: relative;

    ${(props: any) => props.clicked && css`
        overflow: visible;
    `}

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


const ArtistThumbPrev = styled.div`
    position: relative;
    padding: 5px;
    overflow: visible;
    margin-top: 20px;

    p {
        position: absolute;
        width: max-content;
        top: 20px;
        right: -20px;
        color: rgb(100, 214, 238)!important;
    }
`

export interface AchievementListItemProps {
    title: string
    achievements: any[]
    wasClicked: boolean
    handleClick: Function
    achievementTotal: number
}



export const AchievementListItem: React.SFC<AchievementListItemProps> = ({ title, achievements, achievementTotal, wasClicked, handleClick }) => {
    return (<ListItem data-total={achievementTotal} clicked={wasClicked}>
        <Tree name={title} onClick={handleClick}>
            <FlexDiv>
                {achievements.length ? achievements.map(({artistData,achievement}: any) => {
                    const { pk, sk, total, user } = achievement
                    const { artist } = artistData
                    const { hrs, mins } = hrsAndMins(total)

                    return (
                        <ArtistThumbPrev>

                            <AvatarBg src={artist.images && artist.images[0] ? artist.images[0].url : ''} />
                            <ArtistNameDiv>{artist.name}</ArtistNameDiv>
                            <p>{hrs ? `${hrs} hrs and` : null} {mins} min</p>

                        </ArtistThumbPrev>
                    )
                }) : null}

            </FlexDiv>
        </Tree>

    </ListItem>
    );
}

