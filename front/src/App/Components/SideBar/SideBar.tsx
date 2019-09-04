import React, { useContext, createContext, useReducer, useState, Reducer, SetStateAction, useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components'
import { Container } from '../../../shared/ui';
import { List, Avatar, Icon, Drawer, Carousel, Alert } from 'antd';
import { Box } from 'rebass';
import { UserAchievementContext } from '../../Home/Authed/Authed';
import { firstPlaceBadge, IconText, FlexDiv } from '../Elements'
import { determineAchievementValueFromPK, AchievementMetaData } from '../UserAchievementsList/achievements-utils';
import { User } from '../../../../../back/src/fns/graphql/types';
import { DecimalHoursToMinutes, decimalToHrsMins } from '../../../lib/durationFormats';
import { SpotifyLogoLink } from '../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import 'antd/es/drawer/style/css'
import 'antd/es/carousel/style/css'
import 'antd/es/list/style/css'
import 'antd/es/alert/style/css'
import { badgeMap } from '../../Home/Authed/Insights/shared/ArtistsChart/TopListenerYAxis'

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
const ArtistCarouselImage: any = styled.div<{ src: string }>`
display: flex;
align-items: center;
text-align: center;
flex-direction: column;
padding-bottom: 2rem;
margin-bottom: 1rem;
text-decoration: none;
min-height: 250px;
height: 100%;
width: 100%;
border-radius: 0.5rem;
background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({ src }) => src}");
background-position: center center;
background-size: cover;

${(props: any) => props.notLifeTimeAchievement && css`
    height: 50px;
    width: 50px;
    border-radius: 50%;
    min-height: 50px;
  
`}

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

export interface NonPriortityAchievementListProps {
    achievements: AchievementMetaData[]
    title: string
    currentUser: User
    period: string
}

const NonPriortityAchievementList: React.SFC<NonPriortityAchievementListProps> = ({ achievements, period, title, currentUser }) => {


    return (
        <Box>
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={achievements}
                renderItem={item => {

                    const { artistData: { artist: { id, images, name, topListeners }, personal }, achievement } = item
                    const formattedTotal = decimalToHrsMins(personal)
                    const place = determineAchievementValueFromPK(achievement)
                    console.log('TCL: place', place)
                    const appropriateBadge = badgeMap[place]
                    console.log('TCL: appropriateBadge', appropriateBadge)
                    console.log('TCL: place', place)

                    return (
                        <List.Item
                            actions={[
                                <IconText key={1}>
                                    {`${formattedTotal} mins of  ${name}`}
                                </IconText>,

                                <IconText key={2}>
                                    <SpotifyLogoLink href={`https://open.spotify.com/artist/${id}`} />
                                </IconText>
                            ]}
                        >

                            <List.Item.Meta
                                avatar={<Avatar src={appropriateBadge} />}
                            />


                        </List.Item>
                    )
                }}
            />
        </Box>
    );
}

{/* <NonPriortityAchievementList achievements={achievements} period={period} title={title} currentUser={currentUser} /> */}

interface SideBarSectionProps {
    achievements: AchievementMetaData[]
    title: string
    currentUser: User
    period: string
}

const SideBarSection: React.SFC<SideBarSectionProps> = ({ achievements, period, title, currentUser }) => {

    const achievementContext = [
        { title, currentUser }
    ]
    const [currentArtist, setCurrentArtist] = useState(achievements[0])
    const handleCarouselChange = (current: any) => setCurrentArtist(achievements[current])

    const { artistData: { artist: { id, images, name, topListeners }, personal }, achievement } = currentArtist
    const formattedTotal = decimalToHrsMins(personal)


    return   (
        <List
            id='SideBarAchievements'
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
                        className={period !== 'life' ? 'notLifeTimeAchievement' : 'lifetime'}
                        key={title}
                        actions={[
                            <IconText key={1}>
                                {`${formattedTotal} mins of  ${name}`}
                            </IconText>,

                            <IconText key={2}>
                                <SpotifyLogoLink href={`https://open.spotify.com/artist/${id}`} />
                            </IconText>
                        ]}
                        extra={
                            <Carousel autoplay={period === 'life'} afterChange={handleCarouselChange}>
                                {achievements.map((achievementData: AchievementMetaData) => {
                                    const { artistData, achievement }: any = achievementData
                                    const { artist: { name, images } } = artistData
                                    const artistIMG = images[0].url
                                    return (
                                        <div style={{
                                            height: '30vh'
                                        }}>
                                            <ArtistCarouselImage
                                                notLifeTimeAchievement={period !== 'life'}
                                                style={{
                                                    margin: 'auto',
                                                    display: 'block'
                                                }}
                                                width={150}
                                                height='100%'
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
    const description = `Congratulations ${currentUser.displayName}! You have earned the following achievements for these artists. We will soon be introducing our custom rewards platform where you can exchange your achievements for discounts on exclusive artist merchandise`

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
            <Container padded style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                height: '100%'
            }}>

                {achievements ? <Alert message={description} type="info" showIcon /> : null}

                {achievements ? Object.keys(achievements).reverse().map((period: any, i: any) => {
                    const periodAchievements: any = achievements[period]

                    if (periodAchievements && periodAchievements.length) {

                        const aInstance: AchievementMetaData = periodAchievements ? periodAchievements[0].achievement : null
                        const achievementContext = period === 'life' ? 'lifetime achievements' : `achievements this ${period}`
                        const title = `Your ${achievementContext}`


                        return (
                            <Box>
                                <SideBarSection achievements={periodAchievements} period={period} title={title} currentUser={currentUser} />
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

