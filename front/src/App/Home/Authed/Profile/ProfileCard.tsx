import * as React from 'react';
import { Component } from 'react';
import styled, { css } from 'styled-components';

import {
    Signature,
ProfileBackground,
CardWrapper,
LeftWrapper,
PhotoWrapper,
CircleOne,
CircleTwo,
Photo,
SubtitleWrapper,
Name,
Job,
UserHeadphonesAvatar,
ButtonsWrapper,
Button,
RightWrapper,
PanelWrapper,
Description,
} from './ProfileCardStyles'

export interface ProfileCardProps {
    user: any
}
 
export const ProfileCard: React.SFC<ProfileCardProps> = ({user}) => {
    return ( 
        <ProfileBackground>
            <CardWrapper>
                <LeftWrapper>
                    <PhotoWrapper>
                        <CircleOne></CircleOne>
                        <CircleTwo></CircleTwo>
                        <Photo>{user.photoURL ? <img src={user.photoURL} /> : <UserHeadphonesAvatar />}</Photo>
                    </PhotoWrapper>
                    <SubtitleWrapper>
                        <Name></Name>
                        <Job></Job>

                    </SubtitleWrapper>
                    <ButtonsWrapper>
                        <Button></Button>
                        <Button></Button>
                    </ButtonsWrapper>
                </LeftWrapper>
                <RightWrapper>
                    <PanelWrapper></PanelWrapper>
                    <PanelWrapper></PanelWrapper>
                    <PanelWrapper></PanelWrapper>
                </RightWrapper>
            </CardWrapper>



        </ProfileBackground>

     );
}
 





// <div class="panelWrapper">
//     <div class="value">523</div>
//     <div class="description">posts</div>
// </div>
// <div class="panelWrapper">
//     <div class="value">1387</div>
//     <div class="description">likes</div>

// </div>
// <div class="panelWrapper">
//     <div class="value">146</div>
//     <div class="description">followers</div>
// </div>