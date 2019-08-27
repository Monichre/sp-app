import React, { useContext, createContext, useReducer, useState, Reducer, SetStateAction, useCallback, useEffect } from 'react';
import styled from 'styled-components'
import { ButtonSignout, Container } from '../../../shared/ui';
import { Drawer, List, Avatar, Divider, Col, Row, Carousel } from 'antd';
import 'antd/es/drawer/style/css'
import 'antd/es/carousel/style/css'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { Deck } from './Deck'
import { Card, Box, Flex } from 'rebass';
import { UserAchievementContext } from '../../Home/Authed/Authed';
import { FlexDiv, AvatarBg, ArtistNameDiv } from '../Elements';
import { ArtistThumbPrev } from '../UserAchievementsList/AchievementListItem';




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
export interface SideBarProps {

}

export const SideBar: React.SFC<SideBarProps> = () => {
    const context: any = React.useContext(UserAchievementContext)
    const [localAchievements, setLocalAchievements]: any = useState(null)
    const { achievements, isOpen, setSideBarOpen } = context
    const onClose = () => setSideBarOpen((isOpen: any) => !isOpen)

    useEffect(() => {
        if (achievements) {
            setLocalAchievements(achievements)
        }
    }, [achievements])
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
                {localAchievements && localAchievements.life && isOpen ? <Deck cards={localAchievements.life} /> : null}
            </Container>

        </Drawer>

    );
}





// {localAchievements && localAchievements.month ?

//     localAchievements.month.map((achievementData: any, index: number) => {
//         const { achievement, artistData } = achievementData
//         const { formattedTotal } = achievement
//         const { artist } = artistData

//         return (
//             <Card sx={{ minHeight: heights[index] }}>
//                 <FlexDiv>
//                     <ArtistThumbPrev>

//                         <AvatarBg src={artist.images && artist.images[0] ? artist.images[0].url : ''} />
//                         <ArtistNameDiv>{artist.name}</ArtistNameDiv>
//                         <p>{formattedTotal} min</p>

//                     </ArtistThumbPrev>

//                 </FlexDiv>
//             </Card>
//         )
//     })

//     : null}

// {
//     localAchievements && localAchievements.week ?

//     localAchievements.week.map((achievementData: any, index: number) => {
//         const { achievement, artistData } = achievementData
//         const { formattedTotal } = achievement
//         const { artist } = artistData

//         return (
//             <Card sx={{ minHeight: heights[index] }}>
//                 <FlexDiv>
//                     <ArtistThumbPrev>

//                         <AvatarBg src={artist.images && artist.images[0] ? artist.images[0].url : ''} />
//                         <ArtistNameDiv>{artist.name}</ArtistNameDiv>
//                         <p>{formattedTotal} min</p>

//                     </ArtistThumbPrev>

//                 </FlexDiv>
//             </Card>
//         )
//     })
//     : null
// }