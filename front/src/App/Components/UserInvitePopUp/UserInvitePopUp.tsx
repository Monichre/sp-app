import React, { useState } from "react";
import { Popover, Menu } from 'antd';
import { Button } from '../../../shared/ui';
import { UserInviteForm } from './UserInviteForm';
import 'antd/es/popover/style/css'
import 'antd/es/menu/style/css'

export interface ShareProps {

}

export const Share: React.SFC<ShareProps> = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
    );
}

export interface UserConfirmedIconProps {

}

export const UserConfirmedIcon: React.SFC<UserConfirmedIconProps> = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
    );
}

export interface AddUserIconProps {

}

export const AddUserIcon: React.SFC<AddUserIconProps> = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
    );
}

export interface SendIconProps {

}

export const SendIcon: React.SFC<SendIconProps> = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    );
}

export interface UserInvitePopUpProps {
    toggle: any
    visible: any
    currentUserName: any
}


export const UserInvitePopUp: React.SFC<UserInvitePopUpProps> = ({ toggle, visible, currentUserName }) =>  (
        <Popover
            content={<UserInviteForm currentUserName={currentUserName} close={toggle} />}
            title="Invite Your Friends to Soundpruf"
            trigger="click"
            visible={visible}
        >

            <span onClick={toggle}>
                <AddUserIcon /> Add Friends
            </span>
        </Popover>
    );



