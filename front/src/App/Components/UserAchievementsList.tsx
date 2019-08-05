import * as React from 'react'
import { useState, useRef, useEffect, memo } from 'react';
import { useSpring, animated } from 'react-spring'
import styled from 'styled-components';
import { Achievement } from '../../../../back/src/shared/tables/TableAchievement';
import { AchievementsState, AchievementData } from '../Home/Authed/Authed';
import ResizeObserver from 'resize-observer-polyfill'
import * as Icons from '../../shared/icons'


const Frame = styled('div')`
  position: relative;
  padding: 4px 0px 0px 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
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




const ListItem = styled.li`

    display: flex;
    align-items: center;
    padding: 12px 0;
    box-sizing: border-box;
    counter-increment: index; 


&::before {
  content: counters(index, ".", decimal-leading-zero);
  font-size: 1.5rem;
  text-align: right;
  font-weight: bold;
  min-width: 50px;
  padding-right: 12px;
  font-variant-numeric: tabular-nums;
  align-self: flex-start;
  background-image: linear-gradient(to bottom, aquamarine, orangered);
  background-attachment: fixed;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
`

const ListStyle = styled.ul`
    padding: 0 1.5rem;
    counter-reset: index;  


li + li {
    /* border-top: 1px solid rgba(255,255,255,0.2); */
    }

`

const ListWrap = styled.div`

margin-top: 80px;

  h4 {
    color: #fff;
    padding: 0!important;
    text-align: center;
    margin: 0!important;
    font-size: 1.25rem;
  }
  
`

const FlexDiv = styled.div`
    display: flex;
    justify-content: space-around;
    width: 100%;
    padding: 1.5rem 0rem;
    border-top: 1px solid rgba(255,255,255,.1);
    border-bottom: 1px solid rgba(255,255,255,.1);
    background-color: rgba(216,216,216,.05);
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



export interface AchievementItemProps {
    achievement: Achievement
}

const AchievementItem: React.SFC<AchievementItemProps> = ({ achievement }) => {
    return (<ListItem>

    </ListItem>);
}



export interface UserAchievementsListProps {
    userAchievements: any
}

export interface TreeProps {
    children: any,
    name: any,
    style?: any,
    defaultOpen: any

}
 
const Tree: React.SFC<TreeProps> = memo(({ children, name, style, defaultOpen = false }) => {
    const [isOpen, setOpen] = useState(defaultOpen)
    const previous = usePrevious(isOpen)

    const [bind, { height: viewHeight }]: any = useMeasure()
    const { height, opacity, transform }: any = useSpring({
        from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { height: isOpen ? viewHeight : 0, opacity: isOpen ? 1 : 0, transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` }
    })

    // @ts-ignore
    const Icon: any = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`]

    return (
        <Frame>
            <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
            <Title style={style}>{name}</Title>
            <Content style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
                <animated.div style={{ transform }} {...bind} children={children} />
            </Content>
        </Frame>
    )
})
    
    
 

export const UserAchievementsList: React.SFC<UserAchievementsListProps> = ({ userAchievements }) => {

    return (
        <ListWrap>
            <FlexDiv><img src='/icons/award.svg' /> <h4>Achievements</h4></FlexDiv>
            <ListStyle>
                {Object.keys(userAchievements).map((key: any, index: number) => {
                    const { achievement, artists, Badge }: AchievementData = userAchievements[key]
                    return (
                        <ListItem key={index}>{achievement}</ListItem>
                    )
                })}
                
            </ListStyle>
        </ListWrap>
    );
}





// const App = () => (
//   <>
//     <Global />
//     <Tree name="main" defaultOpen>
//       <Tree name="hello" />
//       <Tree name="subtree with children">
//         <Tree name="hello" />
//         <Tree name="sub-subtree with children">
//           <Tree name="child 1" style={{ color: '#37ceff' }} />
//           <Tree name="child 2" style={{ color: '#37ceff' }} />
//           <Tree name="child 3" style={{ color: '#37ceff' }} />
//           <Tree name="custom content">
//             <div style={{ position: 'relative', width: '100%', height: 200, padding: 10 }}>
//               <div style={{ width: '100%', height: '100%', background: 'black', borderRadius: 5 }} />
//             </div>
//           </Tree>
//         </Tree>
//         <Tree name="hello" />
//       </Tree>
//       <Tree name="world" />
//       <Tree name={<span>🙀 something something</span>} />
//     </Tree>
//   </>
// )