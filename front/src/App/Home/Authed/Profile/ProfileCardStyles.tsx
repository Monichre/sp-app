import * as React from 'react';
import { Component } from 'react';
import styled, { css } from 'styled-components';



export const Signature = styled.div`
  position: absolute;
  bottom: -25px;
  font-style: italic;
  font-size: 12px;
  color: #212121;
  text-transform: none;
  text-align: center;
  left: 0;
  right: 0;
`

export const ProfileBackground = styled.div`
  position: relative;
  background: linear-gradient(to top right, #eebe6c 0%, #ca7c4e 100%);
  border-radius: 5px;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.25);
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const CardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
	height: 300px;
	background: white;
	box-shadow: 4px 8px 12px 0 rgba(0,0,0,0.3);
  color: #786450;
  border-radius: 5px;
`

export const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const PhotoWrapper = styled.div`
  position: relative;

  &:hover {
      .circleOne {
        transform: rotate(360deg);
      }
      .circleTwo {
          transform: rotate(-360deg);
      }
  }
  
`

export const CircleOne = styled.div`
  position: absolute;
  width: 83px;
  height: 83px;
  top: -5px;
  left: -5px;
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  border-color:  #786450 #786450 #786450 transparent;
  transition: all 1.5s ease-in-out;
`



export const CircleTwo = styled.div`
  position: absolute;
  width: 89px;
  height: 89px;
  top: -8px;
  left: -8px;
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  border-color: #786450 transparent #786450 #786450;
  transition: all 1.5s ease-in-out;
`



export const Photo = styled.div`
 img {
      width: 75px;
  height: 75px;
  border-radius: 50%;
 }
`

export const SubtitleWrapper = styled.div`
  text-align: center;
  padding: 10px 0 30px;
`

export const Name = styled.div`
  font-weight: bold;
  font-size: 15px;
`

export const Job = styled.div`
  font-size: 12px;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: transparent;
  width: 120px;
  height: 30px;
  border: 1px solid #786450;
  border-radius: 15px;
  font-size: 13px;
  font-weight: bold;
  transition: all .3s ease-in-out;
  color: #786450;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
        background-color: #786450;
  color: white;
  }

  &:active, &:focus {
      outline: none;
  }
`



export const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

export const PanelWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 99px;
    width: 100px;
    background-color: #f5e8df;
    cursor: pointer;
    transition: all .5s ease -in -out;

    &:hover {
        background-color: #e1cfc2;
        .value {
        font-weight: bold;
        font-size: 18px;
        }
    }
`


export const Description = styled.div`
  text-transform: capitalize;
  font-size: 11px;
`


export const UserHeadphonesAvatar = () => (
    <svg height="512" viewBox="0 0 128 128" width="512" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><linearGradient id="linear-gradient" gradientUnits="userSpaceOnUse" x1="112.34" x2="15.66" y1="116.954" y2="20.275"><stop offset="0" stop-color="#e64a19"/><stop offset="1" stop-color="#ffa726"/></linearGradient><path d="m70.25 0h-12.5a52.81 52.81 0 0 0 -52.75 52.75v33.125a1.75 1.75 0 0 0 3.5 0v-5.375h13v32.9a14.773 14.773 0 0 1 -13-14.65v-4.23a1.75 1.75 0 0 0 -3.5 0v4.23a18.272 18.272 0 0 0 16.5 18.161v1.339a9.761 9.761 0 0 0 9.75 9.75h16.417a9.761 9.761 0 0 0 9.75-9.75v-43a9.761 9.761 0 0 0 -9.75-9.75h-16.417a9.761 9.761 0 0 0 -9.75 9.75v1.75h-4.75v-22.5h6.75a1.75 1.75 0 0 0 1.75-1.75 32.537 32.537 0 0 1 32.5-32.5h12.5a32.537 32.537 0 0 1 32.5 32.5 1.75 1.75 0 0 0 1.75 1.75h6.75v22.5h-4.75v-1.75a9.761 9.761 0 0 0 -9.75-9.75h-16.417a9.761 9.761 0 0 0 -9.75 9.75v43a9.761 9.761 0 0 0 9.75 9.75h16.417a9.761 9.761 0 0 0 9.75-9.75v-1.339a18.272 18.272 0 0 0 16.5-18.161v-46a52.81 52.81 0 0 0 -52.75-52.75zm-16.333 75.25v43a6.257 6.257 0 0 1 -6.25 6.25h-3.417v-55.5h3.417a6.257 6.257 0 0 1 6.25 6.25zm-28.917 0a6.257 6.257 0 0 1 6.25-6.25h9.5v55.5h-9.5a6.257 6.257 0 0 1 -6.25-6.25zm-11.75 1.75h-4.75v-22.5h4.75zm57-60.25h-12.5a36.044 36.044 0 0 0 -35.958 34.25h-13.261a49.308 49.308 0 0 1 49.219-47.5h12.5a49.308 49.308 0 0 1 49.219 47.5h-13.261a36.044 36.044 0 0 0 -35.958-34.25zm44.5 37.75h4.75v22.5h-4.75zm-11.75 63.75a6.257 6.257 0 0 1 -6.25 6.25h-9.5v-25.25a1.75 1.75 0 0 0 -3.5 0v25.25h-3.417a6.257 6.257 0 0 1 -6.25-6.25v-43a6.257 6.257 0 0 1 6.25-6.25h3.417v13.125a1.75 1.75 0 0 0 3.5 0v-13.125h9.5a6.257 6.257 0 0 1 6.25 6.25zm16.5-19.5a14.773 14.773 0 0 1 -13 14.647v-32.897h13zm-32.25-9.665v3.205a1.75 1.75 0 0 1 -3.5 0v-3.205a1.75 1.75 0 0 1 3.5 0z" fill="url(#linear-gradient)"/></svg>
)