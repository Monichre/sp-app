import * as React from 'react';
import { useState, useRef, useEffect, memo } from 'react';
import { useSpring, animated, useTransition, useChain, config } from 'react-spring'
import { AvatarBg} from './Elements'
import ResizeObserver from 'resize-observer-polyfill'
import * as Icons from '../../shared/icons'
import styled from 'styled-components';
import { Frame } from './Elements';


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



export const Title = styled('h4')`
  vertical-align: middle;
  margin: 0;
  margin-left: 20px!important;

  img {
    height: 25px;
    width: 25px;
    margin-left: 10px;
  }

`

const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  margin-left: 6px;
  padding: 0px 0px 0px 14px;
  border-left: 1px dashed rgba(255, 255, 255, 0.4);
  overflow: visible;
  
`

const toggle = {
    width: '1em',
    height: '1em',
    marginRight: 10,
    cursor: 'pointer',
    verticalAlign: 'middle'
}




export interface TreeProps {
    children?: any,
    name: any,
    style?: any,
    defaultOpen?: any
    onClick: Function

}


export const Tree: React.SFC<TreeProps> = memo(({ children = false, name, style, defaultOpen = false, onClick }) => {
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

    const firstPlaceBadge: any = '/icons/first-currentUser.png'
    const secondPlaceBadge = '/icons/second-currentUser.png'
    const thirdPlaceBadge = '/icons/third-currentUser.png'

    return (
        <Frame>
            <Icon style={{ ...toggle, opacity: children ? 1 : 0.3 }} onClick={handleClick} />
            <Title style={style}>{name} <AvatarBg tiny={true} src={firstPlaceBadge} />
            </Title>
            <Content style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
                <animated.div style={{ transform }} {...bind} children={children} />
            </Content>
        </Frame>
    )
})
