import * as React from 'react';
import { useState } from 'react';
import {
    ProfileBackground,
    CardWrapper,
    LeftWrapper,
 
    Photo,
    UserHeadphonesAvatar,
    ButtonsWrapper,

} from './ProfileCardStyles'

import { SpotifyLogoLink } from '../../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import { UserInvitePopUp } from '../../../Components/UserInvitePopUp/UserInvitePopUp';
import { Menu } from 'antd';
import {mapSizesToProps} from '../../../../lib/mapSizes'
import withSizes from 'react-sizes'
import 'antd/es/menu/style/css'

export interface ProfileCardProps {
    user: any
    isMobile: boolean
}

export const PC: React.SFC<any> = ({ user, isMobile }) => {
    
    const [visible, setVisible]: any = useState(false)

    const spotifyURL = `https://open.spotify.com/user/${user.uid.split(':')[1]}`

    const toggle = (e: any) => {
        if (e) {
            console.log('TCL: toggle -> e', e)
            e.preventDefault()
}
        // e.stopPropagation()
        setVisible((visible: any) => !visible);
    }

    return (
        <ProfileBackground>
            <CardWrapper>
                <LeftWrapper>

                        <Photo>{user.photoURL ? <img src={user.photoURL} /> : <UserHeadphonesAvatar />}</Photo>
                    
                    <ButtonsWrapper>
                        <p>{user.displayName}</p>
                        <p>{user.email}</p>
                    </ButtonsWrapper>
                </LeftWrapper>
                <Menu mode="horizontal">
                    <Menu.Item key="spotify">
                        <SpotifyLogoLink href={spotifyURL} />
                        Listen on Spotify
                    </Menu.Item>
                    <Menu.Item key="invite">
                        <UserInvitePopUp isMobile={isMobile} toggle={toggle} visible={visible} currentUserName={user.displayName} />
                    </Menu.Item>
                </Menu>
                
            </CardWrapper>
        </ProfileBackground>
    );
}


export const ProfileCard: any = withSizes(mapSizesToProps)(PC)