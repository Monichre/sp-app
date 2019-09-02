import React, { useContext, createContext, useReducer, useState, Reducer, SetStateAction, useCallback, useEffect } from 'react';
import styled from 'styled-components'
import { Container } from '../../../shared/ui';
import { List, Avatar, Icon, Drawer, Carousel } from 'antd';
import { Box } from 'rebass';
import { UserAchievementContext } from '../../Home/Authed/Authed';
import { firstPlaceBadge, IconText } from '../Elements';
import { determineAchievementValueFromPK, AchievementMetaData } from '../UserAchievementsList/achievements-utils';
import { User } from '../../../../../back/src/fns/graphql/types';
import { DecimalHoursToMinutes, decimalToHrsMins } from '../../../lib/durationFormats';
import { SpotifyLogoLink } from '../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import 'antd/es/drawer/style/css'
import 'antd/es/carousel/style/css'
import 'antd/es/list/style/css'

const HoverIcon: any = styled.div`
   margin: 0 auto;
   width: 100%;
   height: 80px;
   max-width:80px;
   background: linear-gradient(90deg, #FF7E7E 0%, #FF4848 40%, rgba(0, 0, 0, 0.28) 60%);
   border-radius: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   color: white;
   transition: all 0.8s ease;
   background-position: 0px;
   background-size: 200px;
`
const HoverTitle: any = styled.div`
width: 100%;
   margin: 0;
   text-align: center;
   margin-top: 30px;
   color: white;
   font-weight: 600;
   text-transform: uppercase;
   letter-spacing: 4px;
`

const HoverText: any = styled.div`
  width: 80%;
   margin: 0 auto;
   font-size: 13px;
   text-align: center;
   margin-top: 20px;
   color: white;
   font-weight: 200;
   letter-spacing: 2px;
   opacity: 0;
   max-height:0;
   transition: all 0.3s ease;
`

const HoverCard: any = styled.div`
  
   width: 150px;
   
   height: 150px;
   background-color: #292929;
   margin: 10px;
   border-radius: 10px;
   box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.24);
   border: 2px solid rgba(7, 7, 7, 0.12);
   font-size: 16px;   
   transition: all 0.3s ease;
   position: relative;
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   cursor: pointer;
   transition: all 0.3s ease;

   &:hover {
    .info {
   height: 90%;
}
    ${HoverText} {
        transition: all 0.3s ease;
        opacity: 1;
        max-height:40px;
    }

       ${HoverIcon} {
        background-position: -120px;
        transition: all 0.3s ease;
        svg {
            background: linear-gradient(90deg, #FF7E7E, #FF4848);
        -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        opacity: 1;
        transition: all 0.3s ease;
        }
       }
   }
`

interface SideBarSectionProps {
    achievements: AchievementMetaData[]
    title: string
    description: string
    currentUser: User
}

const SideBarSection: React.SFC<SideBarSectionProps> = ({ achievements, title, description, currentUser }) => {

    const achievementContext = [
        { title, description, currentUser }
    ]
    const [currentArtist, setCurrentArtist] = useState(achievements[0])
    const handleCarouselChange = (current: any) => setCurrentArtist(achievements[current])

    const { artistData: { artist: { id, images, name, topListeners }, personal }, achievement } = currentArtist
    const formattedTotal = decimalToHrsMins(personal)


    return (
        <List
            itemLayout="vertical"
            size="large"
            pagination={false}
            dataSource={achievementContext}
            footer={
                <div>
                    <b>{title}</b>
                </div>
            }
            renderItem={item => {

                return (
                    <List.Item
                        key={title}
                        actions={[
                            <IconText key={1}>
                                {formattedTotal} minutes of {name}
                            </IconText>,

                            <IconText key={2}>
                                <SpotifyLogoLink href={`https://open.spotify.com/artist/${id}`} />
                            </IconText>
                        ]}
                        extra={
                            <Carousel autoplay afterChange={handleCarouselChange}>
                                {achievements.map((achievementData: AchievementMetaData) => {
                                    const { artistData, achievement }: any = achievementData
                                    const { artist: { name, images } } = artistData
                                    const artistIMG = images[0].url
                                    return (
                                        <div>
                                            <img
                                                width={250}

                                                alt={`${name} featured image`}
                                                src={artistIMG}
                                            />
                                        </div>
                                    )
                                })}

                            </Carousel>

                        }
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={firstPlaceBadge} />}
                            title={title}
                            description={description}
                        />

                    </List.Item>
                )
            }}
        />
    );
}




export interface SideBarProps {

}

export const SideBar: React.SFC<SideBarProps> = () => {
    const context: {
        achievements: AchievementMetaData[],
        isOpen: any,
        setSideBarOpen: any,
        currentUser: User
    } = React.useContext(UserAchievementContext)
    const { achievements, isOpen, setSideBarOpen, currentUser } = context
    const onClose = () => setSideBarOpen((isOpen: any) => !isOpen)

    console.count('SideBar Render Count:')

    return (

        <Drawer
            width={640}
            placement="right"
            onClose={onClose}
            bodyStyle={{
                background: '#030616',
                height: '100%'
            }}
            visible={isOpen}
        >
            <Container padded>

                {achievements ? Object.keys(achievements).map((period: any, i: any) => {
                    const periodAchievements: any = achievements[period]

                    if (periodAchievements && periodAchievements.length) {

                        const aInstance: AchievementMetaData = periodAchievements ? periodAchievements[0].achievement : null
                        const achievementContext = period === 'life' ? 'lifetime achievements' : `achievements this ${period}`
                        const title = `Your ${achievementContext}`
                        const description = periodAchievements && periodAchievements.length ? `Congratulations ${currentUser.displayName}! You have been awarded ${determineAchievementValueFromPK(aInstance)} place top listener for the artists below. We will soon be introducing our rewards program so that you can turn these achievements into discounts on merchandise and additional exclusive offer.` : ''

                        return (
                            <Box>
                                <SideBarSection achievements={periodAchievements} title={title} description={description} currentUser={currentUser} />
                            </Box>
                        )

                    }

                    return null
                }) : null
                }

            </Container>
        </Drawer>

    );
}

