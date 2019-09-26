import React, { useState } from "react";
import { Popover, Menu } from 'antd';
import { Button } from '../../../shared/ui';
import { UserInviteForm } from './UserInviteForm';
import {TitleBar, AddButton} from './UserInviteForm.style';

export interface ShareProps {

}

export const Share: React.SFC<ShareProps> = () => {
    return (
        // @ts-ignore
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
    );
}

export interface UserConfirmedIconProps {

}

export const UserConfirmedIcon: React.SFC<UserConfirmedIconProps> = () => {
    return (
        // @ts-ignore
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
    );
}

export interface AddUserIconProps {

}

export const AddUserIcon: React.SFC<AddUserIconProps> = () => {
    return (
        // @ts-ignore
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
    );
}





export interface UserInvitePopUpProps {
    toggle: any
    visible: any
    currentUserName: any
    isMobile: boolean
}

export interface CloseCircleIconProps {
    
 
}

export const CloseCircleIcon: React.SFC<CloseCircleIconProps> = () => {
    return (
        // @ts-ignore
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64d6ee" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
    );
}


const PopOverTitleBar = ({onClick}: any) => (
    <TitleBar><p>Invite Your Friends to Soundpruf</p><div onClick={onClick}><CloseCircleIcon /></div></TitleBar>
)


export const UserInvitePopUp: React.SFC<UserInvitePopUpProps> = ({ toggle, visible, currentUserName, isMobile }) =>  (
        <Popover
            content={<UserInviteForm currentUserName={currentUserName} close={toggle} />}
            title={<PopOverTitleBar onClick={toggle} />}
            trigger="click"
            visible={visible}
        >
            <span onClick={toggle}>
                <AddUserIcon /> {isMobile ? null : 'Add Friends'}
            </span>
        </Popover>
    );



