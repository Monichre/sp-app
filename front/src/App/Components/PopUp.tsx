import React, { useState, useRef } from 'react'
import { render } from 'react-dom'
import { useTransition, useSpring, useChain, config } from 'react-spring'

import { animated } from 'react-spring'
import styled, { createGlobalStyle } from 'styled-components'

const Global: any = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    margin: 0;
    padding: 0;
    
    width: 100%;
    overflow: hidden;
    user-select: none;
    background: lightblue;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const Container: any = styled(animated.div)`
  position: relative;
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

const Item: any = styled(animated.div)`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 5px;
  will-change: transform, opacity;
`




export  function PopUp({artists}: any) {
  const [open, set] = useState(false)

  const springRef: any = useRef()
  const { size, opacity, ...rest }: any = useSpring({
    ref: springRef,
    config: config.stiff,
    from: { size: '20%', background: 'hotpink' },
    to: { size: open ? '100%' : '20%', background: open ? 'white' : 'hotpink', position: open ? 'fixed' : 'relative', zIndex: 100, top: open ? '50%' : 'auto', left: open ? '50%' : 'auto' }
  })

  const transRef: any = useRef()
  const transitions: any = useTransition(open ? artists : [], item => item.name, {
    ref: transRef,
    unique: true,
    trail: 400 / artists.length,
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' }
  })

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springRef, transRef] : [transRef, springRef], [0, open ? 0.1 : 0.6])

  return (
    <>
      <Global />
      <Container style={{ ...rest, width: size, height: size }} onClick={() => set(open => !open)}>
        {transitions.map(({ item, key, props }: any) => (
          <Item key={key} style={{ ...props, background: item.css }} />
        ))}
      </Container>
    </>
  )
}