import * as React from 'react';
import { Component } from 'react';
import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

const bgSize = 6
export const AlbumBackgroundDiv = styled.div<{ src: string }>`
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

export const ArtistAvatarDiv = styled.div<{ src: string }>`
  height: ${bgSize / 2}rem;
  width: ${bgSize / 2}rem;
  border-radius: ${bgSize / 2 / 2}rem;
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({ src }) => src}");
  background-size: cover;
  `

export const ArtistInfoDiv = styled.div`
`
export const ArtistNameDiv = styled.div`
  /* font-size: ${bgSize / 8}rem; */
  font-weight: 500;
    position: absolute;
  top:0;
  left: 0;
  font-size: 12px;
`

export const PlayDiv = styled.div`
height: ${bgSize * 1.25}rem;
width: ${bgSize * 1.25}rem;
${AlbumBackgroundDiv} {
  margin-top: ${bgSize / 8}rem;
  margin-left: ${bgSize / 2 / 2}rem;
}
`

export const Container = styled(animated.div)`
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

export const Item = styled(animated.div)`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 5px;
  will-change: transform, opacity;
`


export const Frame = styled('div')`
  position: relative;
  /* padding:  10px 0; */
  text-overflow: ellipsis;
  white-space: nowrap;
  /* overflow-x: hidden; */
  
  vertical-align: middle;
  color: white;
  fill: white;
`

export const HeaderFlexDiv = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    padding: 1.5rem 0rem;
    border-top: 1px solid rgba(255,255,255,.1);
    border-bottom: 1px solid rgba(255,255,255,.1);
    background-color: rgba(216,216,216,.05);
`

export const FlexDiv = styled.div`
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
