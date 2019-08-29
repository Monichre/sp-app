import React, { useContext, createContext, useReducer, useState, Reducer, SetStateAction, useCallback, useEffect } from 'react';
import styled from 'styled-components'
import { ButtonSignout, Container } from '../../../shared/ui';
import { Drawer } from 'antd';
import { Deck } from './Deck'
import { Card, Box, Flex, Image, Heading } from 'rebass';
import { UserAchievementContext } from '../../Home/Authed/Authed';
import 'antd/es/drawer/style/css'
import { ArtistLinkBlock } from '../../Home/Authed/Insights/Main/FeaturedArtists';

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



// export interface AchievementHoverCardProps {

// }

// const AchievementHoverCard: React.SFC<AchievementHoverCardProps> = () => {
//     return (  );
// }

// export default AchievementHoverCard;


interface SideBarSectionProps {
    achievements: any[]
    title: any
}

const SideBarSection: React.SFC<SideBarSectionProps> = ({ achievements, title }) => {

    return (
        <Flex sx={{ flexWrap: 'wrap' }}>
            <Box
                sx={{
                    p: 3,
                    flexGrow: 1,
                    flexBasis: 256
                }}>
                {title}
            </Box>
            <Box
                sx={{
                    p: 3,
                    flexGrow: 99999,
                    flexBasis: 0,
                    minWidth: 320
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh'
                    }}>
                    <Box sx={{ p: 3 }}>Header</Box>
                    <Box
                        sx={{
                            flex: '1 1 auto',
                            p: 3
                        }}>
                        {achievements ? <Deck cards={achievements} /> : null}
                    </Box>
                    <Box sx={{ p: 3 }}> Footer</Box>
                </Box>
            </Box>
        </Flex>
    );
}




export interface SideBarProps {

}

export const SideBar: React.SFC<SideBarProps> = () => {
    const context: any = React.useContext(UserAchievementContext)
    const { achievements, isOpen, setSideBarOpen } = context
    const onClose = () => setSideBarOpen((isOpen: any) => !isOpen)

    const { month, week, life } = achievements

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
                    const periodAchievements = achievements[period]
                    return (
                        <Box>
                            <Box sx={{
                                display: 'inline-block',
                                color: 'white',
                                bg: 'primary',
                                px: 2,
                                py: 1,
                                borderRadius: 9999,
                            }}>
                                <h4 style={{
                                        color:'#fff',
                                        padding:' 0!important',
                                        textAlign:'center',
                                        margin: '0!important',
                                        fontSize: '1.25rem'
                                }}>
                                    {period}
                                </h4>

                            </Box>
                            <Flex flexWrap='wrap' justifyContent='center' mx={-2}>
                                {periodAchievements && periodAchievements.length ? periodAchievements.map((achievementData: any) => {
                                    const { artistData, achievement }: any = achievementData
                                    const { artist } = artistData
                                    return (
                                        <Box>
                                            <Card width={150} height={150}>
                                                <ArtistLinkBlock src={artist.images[0].url} />
                                                
                                                <Heading style={{position: 'relative'}}>{artist.name}</Heading>
                                            </Card >
                                        </Box>
                                    )
                                }) : null}
                            </Flex>

                        </Box>

                    )
                }) : null
                }

            </Container>

        </Drawer>

    );
}

