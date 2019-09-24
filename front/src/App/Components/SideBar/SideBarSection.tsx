import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components'
import { List, Avatar, Icon, Drawer, Carousel, Alert, Tabs } from 'antd';
import { AchievementMetaData } from '../UserAchievementsList/achievements-utils';
import { User } from '../../../../../back/src/fns/graphql/types';
import { decimalToHrsMins } from '../../../lib/durationFormats'
import { firstPlaceBadge, IconText, FlexDiv } from '../Elements'
import { ArrowNext, ArrowPrev } from '../../../shared/icons';
import { SpotifyLogoLink } from '../../../shared/SpotifyLogoLink/SpotifyLogoLink';


interface SideBarSectionProps {
    achievements: AchievementMetaData[]
    title: string
    currentUser: User
    period: string
    isMobile: boolean
}

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


export const SideBarSection: React.SFC<SideBarSectionProps> = ({ isMobile, achievements, period, title, currentUser }) => {

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
            {achievements.map((achievementData: AchievementMetaData, index: number) => {
                const { artistData, achievement }: any = achievementData
                const { artist: { name, images } } = artistData
                const artistIMG = images[0] ? images[0].url : ''

                return (
                    <div key={index} style={{
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
            renderItem={(item) => {

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
