import React, {  useState, useRef } from 'react';
import styled, { css } from 'styled-components'
import { Container } from '../../../shared/ui';
import { List, Avatar, Icon, Drawer, Carousel, Alert } from 'antd';
import { Box, Flex } from 'rebass';
import { UserAchievementContext } from '../../Home/Authed/Authed';
import { firstPlaceBadge, IconText, FlexDiv } from '../Elements'
import { AchievementMetaData } from '../UserAchievementsList/achievements-utils';
import { User } from '../../../../../back/src/fns/graphql/types';
import { decimalToHrsMins } from '../../../lib/durationFormats';
import { SpotifyLogoLink } from '../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import { ArrowNext, ArrowPrev } from '../../../shared/icons';
import { mapSizesToProps } from '../../../lib/mapSizes'
import withSizes from 'react-sizes'
import {MobileSidebarSection} from './MobileSidebarSection'
import 'antd/es/drawer/style/css'
import 'antd/es/carousel/style/css'
import 'antd/es/list/style/css'
import 'antd/es/alert/style/css'


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
    height: 100px; 
    width: 100px; 
    min-height: 50px;
    
`}

${(props: any) => props.isMobile && css`
    height: 100px; 
    width: 100px; 
    min-height: 50px;
    
`}

`



const ArrowMenu: any = styled.div`
display: flex;
justify-content: space-between;
position: absolute;
top: 10px;
left: 50%;
z-index: 2;
width: 50%;

${(props: any) => props.small && css`
    padding: 0 60px;
    top: 70px;
`}
`

export interface NonPriortityAchievementListProps {
    achievements: AchievementMetaData[]
    title: string
    currentUser: User
    period: string
}


interface SideBarSectionProps {
    achievements: AchievementMetaData[]
    title: string
    currentUser: User
    period: string
    isMobile: boolean
}




const SideBarSection: React.SFC<SideBarSectionProps> = ({ isMobile, achievements, period, title, currentUser }) => {

    const achievementContext = [
        { title, currentUser }
    ]
    const [currentArtist, setCurrentArtist] = useState(achievements[0])
    const handleCarouselChange = (current: any) => setCurrentArtist(achievements[current])

    const carouselRef: any = useRef()
    console.log('TCL: carouselRef', carouselRef)


    const next = () => {
        console.log('fucking clicking next')
        carouselRef.current.next()
    }
    const prev = () => {
        console.log('fucking clicking prev')
        carouselRef.current.prev()
    }

    const { artistData: { artist: { id, images, name, topListeners }, personal }, achievement } = currentArtist
    const formattedTotal = decimalToHrsMins(personal)
    const size = isMobile ? 'small' : 'large'

    const CarouselExtra = <div>
        <ArrowMenu small={period !== 'life'}>
            <ArrowPrev onClick={prev} />
            <ArrowNext onClick={next} />
        </ArrowMenu>

        <Carousel afterChange={handleCarouselChange} ref={carouselRef}>
            {achievements.map((achievementData: AchievementMetaData) => {
                const { artistData, achievement }: any = achievementData
                const { artist: { name, images } } = artistData
                const artistIMG = images[0] ? images[0].url : ''

                return (
                    <div style={{
                        height: isMobile ? '125px' : '30vh'
                    }}>
                        <ArtistCarouselImage
                            isMobile={isMobile}
                            notLifeTimeAchievement={period !== 'life'}
                            style={{
                                margin: period !== 'life' ? '30px auto' : 'auto',
                                display: 'block'
                            }}
                            width={isMobile ? 125 : 150}
                            height='100%'
                            alt={`${name} featured image`}
                            src={artistIMG}
                        />
                    </div>
                )
            })}

        </Carousel>

    </div>


    return (
        <List
            id='SideBarAchievements'
            itemLayout="vertical"
            size={size}
            pagination={false}
            dataSource={achievementContext}
            footer={isMobile ? <div>
                <b>{title}</b>
            </div> : null

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
                        extra={CarouselExtra}
                    >

                        {isMobile ? null : <List.Item.Meta
                            avatar={<Avatar src={firstPlaceBadge} />}
                            title={title}
                        />}

                    </List.Item>
                )
            }}
        />
    );
}

export interface SideBarProps {
    isMobile: boolean
}

const SB: React.SFC<SideBarProps> = ({ isMobile }) => {
    const context: {
        achievements: AchievementMetaData[],
        isOpen: any,
        setSideBarOpen: any,
        currentUser: User
    } = React.useContext(UserAchievementContext)
    const { achievements, isOpen, setSideBarOpen, currentUser } = context
    const onClose = () => setSideBarOpen((isOpen: any) => !isOpen)
    const description = `Congratulations ${currentUser.displayName}! You have earned the following achievements for these artists.`

    console.count('SideBar Render Count:')

    return (

        <Drawer
            width={isMobile ? '75%' : '50%'}
            placement="right"
            onClose={onClose}
            bodyStyle={{
                background: '#030616',
                height: '100%'
            }}
            visible={isOpen}
        >
            <Container sideBarMobile={isMobile} sideBar={true}>

                {isMobile ? null : achievements && <Alert message={description} type="info" showIcon />}

                {achievements && Object.keys(achievements).reverse().map((period: any, i: any) => {
                    const periodAchievements: any = achievements[period]

                    if (periodAchievements && periodAchievements.length) {

                        const achievementContext = period === 'life' ? 'lifetime achievements' : `achievements this ${period}`
                        const title = `Your ${achievementContext}`

                        return (
                            <Box key={`sidebar_section_box_${i}`}>
                                {isMobile ? <MobileSidebarSection key={`mobile_sidebar_section_${i}`} achievements={periodAchievements} isMobile={isMobile} period={period} title={title} currentUser={currentUser} /> : <SideBarSection key={`sidebar_section_${i}`} achievements={periodAchievements} isMobile={isMobile} period={period} title={title} currentUser={currentUser} /> }
                            </Box>
                        )
                    }

                    return null
                })}

            </Container>
        </Drawer>

    );
}

export const SideBar: any = withSizes(mapSizesToProps)(SB)