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
RightWrapper,
PanelWrapper,
Description,
} from './ProfileCardStyles'
import { Button, GradientButtonFilled } from '../../../../shared/ui';
import { SpotifyLogoLink } from '../../../../shared/SpotifyLogoLink/SpotifyLogoLink';

export interface ProfileCardProps {
    user: any
}
 
export const ProfileCard: React.SFC<ProfileCardProps> = ({ user }) => {
    const spotifyURL= `https://open.spotify.com/user/${user.uid.split(':')[1]}`
    console.log('TCL: spotifyURL', spotifyURL)
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
                        <h4 style={{color: 'white'}}>Listen on Spotify</h4>
                    <SpotifyLogoLink
                                href={spotifyURL} />

                    </SubtitleWrapper>
                    <ButtonsWrapper>
                        <Button>{user.displayName}</Button>
                        <Button>{user.email}</Button>
                    </ButtonsWrapper>
                </LeftWrapper>
                <RightWrapper>
                    <PanelWrapper>

                    </PanelWrapper>
                    <PanelWrapper>
                    
                    </PanelWrapper>
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