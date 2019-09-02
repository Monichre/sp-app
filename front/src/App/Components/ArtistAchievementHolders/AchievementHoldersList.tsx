import * as React from 'react';
import { ArtistsFragmentArtist, useGetArtistAchievementHolders } from '../../../types';
import { User } from '../../../../../back/src/fns/graphql/types';
import { ListStyle } from '../ListStyle';
import { decimalToHrsMins, hrsAndMins } from '../../../lib/durationFormats';
import { Popover, List, Row, Col, Card, Icon, Tag, Avatar } from 'antd';
import { IconText, AvatarBg } from '../Elements';
import 'antd/es/popover/style/css'
import 'antd/es/tag/style/css'
import 'antd/es/list/style/css'
import 'antd/es/avatar/style/css'

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
        console.log('TCL: items', items)


        return (

            <ListStyle {...{ style }}>
                <List id='achievementHoldersList' dataSource={items} renderItem={item => {
                    console.log('TCL: item', item)
    
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
                                                actions={[
                                                    <IconText key={2}><Tag color="cyan">{index === 1 ? 'Second' : index === 0 ? 'first' : 'third'}</Tag></IconText>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={<AvatarBg achievementHoldersList><Avatar src={topListener.user && topListener.user.photoURL ? topListener.user.photoURL : '/icons/headphones.svg'} /></AvatarBg>}
                                                    title={user.name}
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




