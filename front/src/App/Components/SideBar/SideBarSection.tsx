import * as React from 'react';
import styled from 'styled-components';
import { Tree, Icon, Collapse, Tabs } from 'antd';
import { FirstPlaceBadge, SecondPlaceBadge, ThirdPlaceBadge } from '../Badge'
import { AchievementMetaData } from '../UserAchievementsList/achievements-utils';
import { User } from '../../../../../back/src/fns/graphql/types';
import { firstPlaceBadge } from '../Elements'
import { decimalToHrsMins } from '../../../lib/durationFormats';
import { AchievementItemArtistIMG } from './SideBar.style';

const { Panel } = Collapse;



export interface SidebarSectionProps {
    achievements: AchievementMetaData[]
    title: string
    currentUser: User
    period: string
    
    i: any
}

const genIcon = (src: any) => <AchievementItemArtistIMG src={src}  />

export const SidebarSection: React.SFC<SidebarSectionProps> = ({  achievements, period, title, currentUser, i }) => {
    return (
        <Collapse defaultActiveKey="1" accordion>
            {achievements.map((achievementData: AchievementMetaData, index: number) => {
                const { artistData, achievement }: any = achievementData
                const { personal } = artistData
                const formattedTotal = decimalToHrsMins(personal)
                const { artist: { name, images } } = artistData
                const artistIMG = images[0] ? images[0].url : ''

                return (
                    <Panel header={name} key={index} showArrow={false} 
                    extra={genIcon(artistIMG)}>
                        <p><img src={firstPlaceBadge} height={24} width={24} style={{ borderRadius: '50%' }} /> {`${formattedTotal} mins of  ${name}`}</p>
                    </Panel>
                )
            })}
        </Collapse>
    );
}