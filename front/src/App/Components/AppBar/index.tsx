import * as React from 'react';
import { HeaderBar, AvatarLink, NavLabel } from './AppBar.style';
import { AvatarBg } from '../../Components/Elements';
import { UserAchievementContext } from '../../Home/Authed/Authed';
import { Flex, Box } from 'rebass';
import { MenuIcon } from '../../../shared/icons';

export interface AppBarProps {

}

export const AppBar: React.SFC<AppBarProps> = () => {

    const { isOpen, setSideBarOpen, currentUser }: any = React.useContext(UserAchievementContext)

    return (
        <HeaderBar>
            <Flex justifyContent='space-between' alignItems='center'>
                <Box>
                <AvatarLink to='/profile'>
                    <AvatarBg sideNav={true} src={currentUser.photoURL ? currentUser.photoURL : '/icons/headphones.svg'} />
                    <NavLabel>{currentUser.displayName ? currentUser.displayName : currentUser.email}</NavLabel>
                </AvatarLink>
                </Box>
                <Box style={{ cursor: 'pointer' }} onClick={() => setSideBarOpen((isOpen: any) => !isOpen)}><MenuIcon /></Box>
            </Flex>

        </HeaderBar>
    );
}

