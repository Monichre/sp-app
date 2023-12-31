import * as React from 'react';
import { Component } from 'react';
import styled, { css } from 'styled-components';
import { animated } from 'react-spring';
import { notLargeQuery } from '../../shared/media';

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

export const IconText = styled.span`
opacity: 1;
color: #fff;
svg {
    opacity: 1;
}

`


export const AvatarBg: any = styled.div<{ src: string }>`
  position: relative;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: ${bgSize / 2 / 2}rem;
  background: linear-gradient( rgba(192, 54, 208, .15), rgba(192, 54, 208, .15) ), url("${({ src }) => src}");
  /* background-image: linear-gradient(to bottom, #e64a19 0%, #ffa726 100%); */
  background-size: cover;
  

  &:before {
    border-radius: 50%;
    content: '';
    background-image: linear-gradient(to bottom, #e64a19 0%, #ffa726 100%);
     height: 2.6rem;
    width: 2.6rem;
    position:absolute;
    z-index:-1;
}

${(props: any) => props.artistPage && css`
    height: 2.5rem;
    width: 2.5rem;

    img {
      height: 5.5rem;
      width: 5.5rem;
      border-radius: 12px;
      position: absolute;
      left: 0;
      z-index: 1;
    }

    &:before {
    border-radius: 12px
    content: '';
    background-image: linear-gradient(to bottom, #e64a19 0%, #ffa726 100%);
    height: 5.7rem;
    width: 5.7rem;
    position:absolute;
    top: -1px;
    left: -1px;
    z-index: 0;
}
    
`}


${(props: any) => props.achievementHoldersList && css`
    height: 3.9rem;
    width: 2.9rem;

    img, .ant-avatar.ant-avatar-circle.ant-avatar-image {
      height: 3.9rem!important;
      width: 2.9rem!important;
      border-radius: 12px;
      object-fit: cover;
    }

    &:before {
    border-radius: 12px;
    content: '';
    background-image: linear-gradient(to bottom, #e64a19 0%, #ffa726 100%);
    height: 4rem;
    width: 3rem;
    position:absolute;
    top: -1px;
    left: -1px;
    z-index: 0;
}
    
`}
  

${(props: any) => props.sideNav && css`
    left: 0;
    /* z-index: -1; */
    position: absolute;

    &:before {
      left: 0;
      z-index: -2;
    }

   
    
`}

${(props: any) => props.tiny && css`

    right: 0;
    top: 10px;
    position: absolute;
    right: 15px;
    top: 15px;
    height: 1.75rem;
    width: 1.75rem;

    &:before {
      right: 0;
      height: 2rem;
      right: 0;
      top: 0;
      width: 2rem;
    }
    &:after {
      border-radius: 50%;
      content: '';
      background-color: #030616;
      height: 2rem;
    width: 2rem;
      position:absolute;
      z-index:-1;
      right: 1px;
      top: 1px;
}
`}
  `

export const ArtistInfoDiv = styled.div`
`
export const ArtistNameDiv = styled.div`
  /* font-size: ${bgSize / 8}rem; */
  font-weight: 500;
  position: absolute;
  min-width: max-content;
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
  overflow: visible;
`


export const Frame = styled('div')`
  position: relative;
  padding:  10px 0 0;
  text-overflow: ellipsis;

  vertical-align: middle;
  color: white;
  fill: white;
`

export const HeaderFlexDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 1.5rem;
    border-top: 1px solid rgba(255,255,255,.1);
    border-bottom: 1px solid rgba(255,255,255,.1);
    background-color: rgba(216,216,216,.05);
`

export const FlexDiv = styled.div`
    display: flex;
    justify-content: space-evenly;
    /* align-content: center; */
    flex-direction: column;
    width: 100%;
    max-width: 100vw;
    margin: 10px 0;
    padding-left: 15px;
    position: relative;
    overflow: visible;
    
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
        /* background-color: rgba(216,216,216,.05); */
    }
`

export const firstPlaceBadge: any = '/icons/first-currentUser.png'
export const secondPlaceBadge = '/icons/second-currentUser.png'
export const thirdPlaceBadge = '/icons/third-currentUser.png'