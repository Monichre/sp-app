import * as React from 'react'
import { useState, useRef, useEffect, memo } from 'react';
import { useSpring, animated, useTransition, useChain, config  } from 'react-spring'
import styled, { css} from 'styled-components';
import { Achievement } from '../../../../back/src/shared/tables/TableAchievement';
import { AchievementsState, AchievementData } from '../Home/Authed/Authed';
import ResizeObserver from 'resize-observer-polyfill'
import * as Icons from '../../shared/icons'
import { hrsAndMinsAndSecs } from '../../lib/durationFormats';
import { useGetUserAchievements } from '../../types';
import { suspensefulHook } from '../../lib/suspensefulHook';
import moment from 'moment'
import {PopUp} from './PopUp'

const bgSize = 6
const AlbumBackgroundDiv = styled.div<{ src: string }>`
  content: "";
  position: absolute;
  height: ${bgSize}rem;
  width: ${bgSize}rem;
  z-index: -1;
  background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4) ), url("${({ src }) => src}");
  background-repeat: no-repeat;
  border-radius: 1rem;
  background-size: cover;
`

const ArtistAvatarDiv = styled.div<{ src: string }>`
  height: ${bgSize / 2}rem;
  width: ${bgSize / 2}rem;
  border-radius: ${bgSize / 2 / 2}rem;
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({ src }) => src}");
  background-size: cover;
  `

const ArtistInfoDiv = styled.div`
`
const ArtistNameDiv = styled.div`
  /* font-size: ${bgSize / 8}rem; */
  font-weight: 500;
    position: absolute;
  top:0;
  left: 0;
  font-size: 12px;
`

const PlayDiv = styled.div`
height: ${bgSize * 1.25}rem;
width: ${bgSize * 1.25}rem;
${AlbumBackgroundDiv} {
  margin-top: ${bgSize / 8}rem;
  margin-left: ${bgSize / 2 / 2}rem;
}
`

const Container = styled(animated.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
  grid-gap: 25px;
  padding: 25px;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0px 10px 10px -5px rgba(0, 0, 0, 0.05);
  will-change: width, height;
`

const Item = styled(animated.div)`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 5px;
  will-change: transform, opacity;
`


const Frame = styled('div')`
  position: relative;
  /* padding:  10px 0; */
  text-overflow: ellipsis;
  white-space: nowrap;
  /* overflow-x: hidden; */
  
  vertical-align: middle;
  color: white;
  fill: white;
`

const Title = styled('span')`
  vertical-align: middle;

`

const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  margin-left: 6px;
  padding: 0px 0px 0px 14px;
  border-left: 1px dashed rgba(255, 255, 255, 0.4);
  overflow: hidden;
  
`

const toggle = {
    width: '1em',
    height: '1em',
    marginRight: 10,
    cursor: 'pointer',
    verticalAlign: 'middle'
}




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

const ListStyle = styled.ul`
    padding: 0 .5rem;
    counter-reset: index;  
    overflow: visible;


li + li {
    /* border-top: 1px solid rgba(255,255,255,0.2); */
    }

`

const ListWrap = styled.div`
    background-color: #030616;
    position: fixed;
    left: 0;
    top: 30vh;
    width: 200px;
    overflow: visible;
    height: auto; 
    border-right: 1px solid rgba(255,255,255,.1);
    z-index: 20;

  h4 {
    color: #fff;
    padding: 0!important;
    text-align: center;
    margin: 0!important;
    font-size: 1.25rem;
  }
  
`

const HeaderFlexDiv = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    padding: 1.5rem 0rem;
    border-top: 1px solid rgba(255,255,255,.1);
    border-bottom: 1px solid rgba(255,255,255,.1);
    background-color: rgba(216,216,216,.05);
`

const FlexDiv = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-content: center;
    width: 100%;
    max-width: 100vw;
    margin: 10px 0;
    position: relative;
    overflow-x: scroll;
    padding: 0 40px;
    z-index: 20;
    /* border-top: 1px solid rgba(255,255,255,.1); */
    /* border-bottom: 1px solid rgba(255,255,255,.1); */
    /* background-color: rgba(216,216,216,.05); */
    background-color: #030616;

    &::before {
        position: absolute;
        top: 0;
        content: '';
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(216,216,216,.05);
    }
`

export function usePrevious (value: any) {
    const ref = useRef()
    useEffect(() => void (ref.current = value), [value])
    return ref.current
}

export function useMeasure () {
    const ref: any = useRef()
    const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 })
    const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)))
    useEffect(() => {
        if (ref.current) ro.observe(ref.current)
        return () => ro.disconnect()
    }, [])
    return [{ ref }, bounds]
}

export interface UserAchievementsListProps {
    userId: string
    children?: any
}

export interface TreeProps {
    children?: any,
    name: any,
    style?: any,
    defaultOpen?: any
    onClick: Function

}

const extractAchievementTypeAndValue = (pk: any) => {
    const split = pk.split('#')
    const end = split.length - 1

    const achievementType = split[end - 1]
    const achievementValue = split[end]

    return {
        achievementType,
        achievementValue
    }
}



export interface AchievementItemProps {
    achievementData: AchievementData
    title: string,
    achievements: any[]
}

const Tree: React.SFC<TreeProps> = memo(({ children = false, name, style, defaultOpen = false, onClick }) => {
    const [isOpen, setOpen] = useState(defaultOpen)
    const previous = usePrevious(isOpen)

    const [bind, { height: viewHeight }]: any = useMeasure()
    const { height, opacity, transform }: any = useSpring({
        from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { height: isOpen ? viewHeight : 0, opacity: isOpen ? 1 : 0, transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` }
    })

    // @ts-ignore
    const Icon: any = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`]

    const handleClick = () => {
        onClick()
        setOpen(!isOpen)
    }

    return (
        <Frame>
            <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={handleClick} />
            <Title style={style}>{name}</Title>
            <Content style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
                <animated.div style={{ transform }} {...bind} children={children} />
            </Content>
        </Frame>
    )
})


const AchievementItem: any = ({achievement}: any) => {
    let [loaded, setLoaded] = useState(false)
       const { artist, fk, pk, sk, total, user } = achievement
        const { achievementType, achievementValue } = extractAchievementTypeAndValue(pk)
        const { hrs, mins} = hrsAndMins(total)
        const ttl = loaded ? useSpring({ total: mins, from: { total: 0 } }) : {total: 0}

            useEffect(() => setLoaded(loaded => !loaded))

     return (
                                            <div style={{ margin: '10px 10px 0', position: 'relative', padding: '10px 10px 0' }}>
                                                <ArtistAvatarDiv src={artist.images[0].url} />
                                                <ArtistNameDiv>{artist.name}</ArtistNameDiv>
                                                <p><animated.span>{ttl.total}</animated.span> minutes</p>
                                            </div>
                                        )
}


const FirstPlaceAchievements: any = ({firsts, wasClicked, handleClick}: any) => {
   
    return (
         <ListItem data-total={firsts.length} clicked={wasClicked}>
                        <Tree name='First' onClick={handleClick}>
                            <FlexDiv>
                                {firsts.length ? firsts.map((achievement: any) => <AchievementItem achievement={achievement} />) : null}

                            </FlexDiv>
                        </Tree>

                    </ListItem>
    )
}


export const hrsAndMins = (durationMs: number) => {
  const d = moment.duration(durationMs)
  return {
    hrs: Math.abs(Math.trunc(d.asHours())),
    mins: Math.abs(d.minutes()),
  }
}

const hrsMaybeMins = ({hrs, mins}: {hrs: number, mins: number}) =>
  hrs > 100 ? { hrs } : { hrs, mins }

const decimalToHrsMins = (value: number) => `${Math.floor(value)}:${Math.floor((value % 1) * 60).toString().padStart(2, '0')}`

export const UserAchievementsList: React.SFC<UserAchievementsListProps> = ({ userId }) => {

      

    const [wasClicked, setClicked] = useState(false)
    const handleClick = () => setClicked(wasClicked => !wasClicked)

    

    const topsBitch = {
        first: {
            pk: `global#artist#life#life#topListener#first`,
            fk: `#topListener#first#${userId}`,
        },
        second: {
            pk: `global#artist#life#life#topListener#second`,
            fk: `#topListener#second#${userId}`,
        },
        third: {
            pk: `global#artist#life#life#topListener#third`,
            fk: `#topListener#third#${userId}`,
        }
    }
    
    const data: any = suspensefulHook(useGetUserAchievements({ variables: { pk: topsBitch.first.pk, fk: topsBitch.first.fk }, suspend: true, pollInterval: 15000 }))
    

    const { getUserAchievements }: any = data
    const achievements: any = getUserAchievements.length ? getUserAchievements.map((achievement: any) => {

        let total: any = hrsAndMins(achievement.total)
        achievement.formattedTotal = total

        return achievement
    }) : []

    const [firsts, seconds, thirds]: any = [achievements.filter((achievement: any) => achievement.pk === topsBitch.first.pk), achievements.filter((achievement: any) => achievement.pk === topsBitch.second.pk), achievements.filter((achievement: any) => achievement.pk === topsBitch.third.pk)]

    return (
        <ListWrap>
            <HeaderFlexDiv><img src='/icons/award.svg' /> <h4>Achievements</h4></HeaderFlexDiv>
            <ListStyle>
                <ListItem data-total={firsts.length} clicked={wasClicked}>
                    {/* <PopUp artists={firsts.map((first: any) => first.artist)} /> */}
                        <Tree name='First' onClick={handleClick}>
                            <FlexDiv>

                                
                                {firsts.length ? firsts.map((achievement: any) => {
                                    const { artist, fk, pk, sk, total, user } = achievement
                                    const { achievementType, achievementValue } = extractAchievementTypeAndValue(pk)
                                    const { hrs, mins} = hrsAndMins(total)
                                   
                                        return (
                                            // <PopUp artists={firsts.map(first => first.artist)} />
                                            <div style={{ margin: '10px', position: 'relative', padding: '10px' }}>
                                                <ArtistAvatarDiv src={artist.images[0].url} />
                                                <ArtistNameDiv>{artist.name}</ArtistNameDiv>
                                                <p>{mins} minutes</p>
                                            </div>
                                        )
                                }) : null} 

                            </FlexDiv>
                        </Tree>

                    </ListItem>
                    {seconds.length ? 
                     <ListItem data-total={firsts.length} clicked={wasClicked}>
                        <Tree name='Second' onClick={handleClick}>
                            <FlexDiv>
                                {seconds.map((achievement: any) => {
                                    const { artist, fk, pk, sk, total, user } = achievement
                                    const { hrs, mins} = hrsAndMins(total)
                                    const { achievementType, achievementValue } = extractAchievementTypeAndValue(pk)
    
                                        return (
                                            <div style={{ margin: '10px', position: 'relative', padding: '10px' }}>
                                                <ArtistAvatarDiv src={artist.images[0].url} />
                                                <ArtistNameDiv>{artist.name}</ArtistNameDiv>
                                                <p>{hrs}{mins}</p>
                                            </div>
                                        )})
                                    }


                            </FlexDiv>
                        </Tree>

                    </ListItem>
                    : null}
                
            </ListStyle>
        </ListWrap>
    );
}
