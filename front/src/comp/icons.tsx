import * as React from "react"
import styled from 'styled-components'

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