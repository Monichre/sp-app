import * as React from 'react';
import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { User } from '../../../../../back/src/fns/graphql/types';
import { ArtistsFragmentArtist } from '../../../types';
import { hrsAndMins } from '../../../lib/durationFormats';
import { ArtistAvatarDiv, ArtistNameDiv, FlexDiv } from '../Elements';
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

export interface AchievementListItemProps {
    title: string
    achievements: any[]
    wasClicked: boolean
    handleClick: Function
}



export const AchievementListItem: React.SFC<AchievementListItemProps> = ({ title, achievements, wasClicked, handleClick }) => {
    return (<ListItem data-total={achievements.length} clicked={wasClicked}>
        <Tree name={title} onClick={handleClick}>
            <FlexDiv>
                {achievements.length ? achievements.map((achievement: any) => {
                    const { artist, fk, pk, sk, total, user } = achievement
                    const { hrs, mins } = hrsAndMins(total)

                    return (
                        <div style={{ margin: '10px', position: 'relative', padding: '10px' }}>
                            <ArtistAvatarDiv src={artist.images && artist.images[0] ? artist.images[0].url : ''} />
                            <ArtistNameDiv>{artist.name}</ArtistNameDiv>
                            <p>{hrs ? `${hrs} hours and` : null} {mins} minutes</p>
                        </div>
                    )
                }) : null}

            </FlexDiv>
        </Tree>

    </ListItem>
    );
}

