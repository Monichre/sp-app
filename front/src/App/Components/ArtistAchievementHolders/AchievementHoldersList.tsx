import * as React from 'react';
import { ArtistsFragmentArtist, useGetArtistAchievementHolders } from '../../../types';
import { User } from '../../../../../back/src/fns/graphql/types';
import { ListStyle } from '../ListStyle';
import { decimalToHrsMins, hrsAndMins } from '../../../lib/durationFormats';
import { Popover, List, Row, Col, Card, Icon, Tag, Avatar, Badge } from 'antd';
import { IconText, AvatarBg } from '../Elements';
import 'antd/es/popover/style/css'
import 'antd/es/tag/style/css'
import 'antd/es/list/style/css'
import 'antd/es/avatar/style/css'
import { badgeMap } from '../../Home/Authed/Insights/shared/ArtistsChart/TopListenerYAxis';

export interface AchievementHoldersListProps {
    artist: ArtistsFragmentArtist
    style?: any,
    achievementHolders: any
}

export const AchievementHoldersList: React.SFC<AchievementHoldersListProps> = ({ artist, style, achievementHolders }) => {

    if(achievementHolders) {
        const { day, week, month, life } = achievementHolders
        const items = [{ title: 'Today', ...day }, { title: 'This Week', ...week }, { title: 'This Month', ...month }, { title: 'Lifetime', ...life }].filter((timePeriod: any) => {
            const { first, second, third } = timePeriod
            return (first.user !== null)
        })

        return (

            <ListStyle {...{ style }}>
                <List id='achievementHoldersList' dataSource={items} renderItem={item => {
                    return (
                        <List.Item>
                            <Card title={item.title}>
                                <List
                                    itemLayout="vertical"
                                    size="large"
                                    dataSource={[item.first, item.second, item.third].filter((item: any) => item.user !== null)}
                                    renderItem={(topListener, index) => {
                                        const { user } = topListener
                                        const { hrs, mins } = hrsAndMins(topListener.total)
                                        const hours = hrs ? `${hrs} hours & ` : ''
                                        const minutes = mins ? `${mins} mins` : ''
                                        const ttl = `${hours}${minutes}`
    
                                        console.log('TCL: topListener', topListener)
                                        return (
                                            <List.Item
                                                key={`${item.title}_${index}`}
                                            >
                                                <List.Item.Meta
                                                    avatar={
                                                        
                                                            <Badge count={<img src={badgeMap[index]} style={{
                                                              height: '25px',
                                                              width: '25px',
                                                              zIndex: 2,
                                                              // left: '100%'
                                                            }} />}>
                                                              <AvatarBg achievementHoldersList><Avatar src={user.photoURL ? user.photoURL : '/icons/headphones.svg'} /></AvatarBg>
                                                            </Badge>
                                                          }
                                                    title={user.displayName}
                                                    description={ttl}
                                                />
    
                                            </List.Item>
                                        )
                                    }}
                                />
                            </Card>
                        </List.Item>
                    )
                }} />
            </ListStyle>
    
        );

    }
    return null    
}




