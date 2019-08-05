import * as React from "react"
import styled from 'styled-components'

export const MinusSquareO = (props: any) => (
  <svg {...props} viewBox="64 -65 897 897">
    <g>
      <path
        d="M888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0zM732 347h-442q-14 0 -25 10.5t-11 25.5v0q0 15 11 25.5t25 10.5h442q14 0 25 -10.5t11 -25.5v0
  q0 -15 -11 -25.5t-25 -10.5z"
      />
    </g>
  </svg>
)

export const PlusSquareO = (props: any) => (
  <svg {...props} viewBox="64 -65 897 897">
    <g>
      <path
        d="M888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0zM732 420h-184v183q0 15 -10.5 25.5t-25.5 10.5v0q-14 0 -25 -10.5t-11 -25.5v-183h-184
  q-15 0 -25.5 -11t-10.5 -25v0q0 -15 10.5 -25.5t25.5 -10.5h184v-183q0 -15 11 -25.5t25 -10.5v0q15 0 25.5 10.5t10.5 25.5v183h184q15 0 25.5 10.5t10.5 25.5v0q0 14 -10.5 25t-25.5 11z"
      />
    </g>
  </svg>
)

export const CloseSquareO = (props: any) => (
  <svg {...props} viewBox="64 -65 897 897">
    <g>
      <path
        d="M717.5 589.5q-10.5 10.5 -25.5 10.5t-26 -10l-154 -155l-154 155q-11 10 -26 10t-25.5 -10.5t-10.5 -25.5t11 -25l154 -155l-154 -155q-11 -10 -11 -25t10.5 -25.5t25.5 -10.5t26 10l154 155l154 -155q11 -10 26 -10t25.5 10.5t10.5 25t-11 25.5l-154 155l154 155
  q11 10 11 25t-10.5 25.5zM888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0z"
      />
    </g>
  </svg>
)




export const Music = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-music"
  >
    <path d="M9 17H5a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm12-2h-4a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2z" />
    <polyline points="9 17 9 5 21 3 21 15" />
  </svg>
)

export const FirstTopListenerAward = () => (<img src='/icons/first.svg' />)

// not animating now -- is this animating in the other branch?
const MenuIconStyles = styled.div`

  position: relative;
  // top: 20px;
  // right: 20px;
  width: 36px;
  height: 36px;
  display: block;
  cursor: pointer;
  transition: opacity 0.2s linear;
  &:hover {
    opacity: 0.8;
  }
  span {
    display: block;

    height: 2px;
    width: 30px;
    background-color: #fff;
    position: absolute;

    overflow: hidden;
    transition: all 0.4s ease;
    &:nth-child(1) {
      top: 11px;
      left: 2px;
      width: 16px;
      transition: 0.3s top ease-in-out 0.1s, 0.3s left ease-in-out 0.1s,
        transform 0.3s ease-in-out, background 0.3s ease-in-out 0.3s;
      transform-origin: center;
      z-index: 9;
    }
    &:nth-child(2) {
      top: 17px;
      left: 2px;
      width: 28px;
      transition: height ease-in-out 0.3s;
      transform-origin: center;
    }
    &:nth-child(3) {
      top: 23px;
      left: 18px;
      width: 16px;
      transition: 0.3s top ease-in-out 0.1s, 0.3s left ease-in-out 0.1s,
        transform 0.3s ease-in-out, background 0.3s ease-in-out 0.3s;
      transform-origin: center;
    }
`

export const MenuIcon: React.SFC = () => {
  return (
    <MenuIconStyles>
      <span className="cls" />
      <span />
      <span className="cls" />
    </MenuIconStyles>
  )
}