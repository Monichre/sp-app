import * as React from 'react';
import { HeaderBar, AvatarLink, NavLabel } from './AppBar.style';
import { AvatarBg } from '../../Components/Elements';
import { UserAchievementContext } from '../../Home/Authed/Authed';
import { Flex, Box } from 'rebass';
import { MenuIcon } from '../../../shared/icons';
import { UserInvitePopUp } from '../UserInvitePopUp/UserInvitePopUp';
import { SpotifyLogoLink } from '../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import { Menu } from 'antd';
import {mapSizesToProps} from '../../../lib/mapSizes'
import withSizes from 'react-sizes'
import 'antd/es/menu/style/css'

export interface AppBarProps {
    className: string
    isMobile: boolean
}

const AB: React.SFC<any> = ({className, isMobile}) => {

    const { isOpen, setSideBarOpen, currentUser }: any = React.useContext(UserAchievementContext)
    const [visible, setVisible]: any = React.useState(false)

    const spotifyURL = `https://open.spotify.com/user/${currentUser.uid.split(':')[1]}`

    const toggle = (e: any) => {
        if (e) {
            console.log('TCL: toggle -> e', e)
            e.preventDefault()
        }
        setVisible((visible: any) => !visible);
    }

    return (
        <HeaderBar className={className}>
            <Flex justifyContent='space-between' alignItems='center'>
                <Box>
                    <Menu mode="horizontal">
                        <Menu.Item key="profile">
                            <AvatarLink to='/profile'>
                                <AvatarBg sideNav={true} src={currentUser.photoURL ? currentUser.photoURL : '/icons/headphones.svg'} />
                            </AvatarLink>
                        </Menu.Item>
                        <Menu.Item key="invite">
                            <UserInvitePopUp toggle={toggle} isMobile={isMobile} visible={visible} currentUserName={currentUser.displayName} />
                        </Menu.Item>
                        <Menu.Item key="spotify-link">
                            <SpotifyLogoLink href={spotifyURL} />
                            {isMobile ? null : 'Listen on Spotify'}
                    </Menu.Item>
                    </Menu>

                </Box>
                <Box style={{ cursor: 'pointer', padding: '0.85rem 1rem' }} onClick={() => setSideBarOpen((isOpen: any) => !isOpen)}><MenuIcon /></Box>
            </Flex>

        </HeaderBar>
    );
}

export const AppBar: any = withSizes(mapSizesToProps)(AB)
