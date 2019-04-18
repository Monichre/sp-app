import React, { useState } from 'react'
import { useUser, useAuthHandlers, BasicUser, impersonate } from '../../FirebaseContext';
import styled from 'styled-components'
import { MenuIcon } from '../../../shared/icons';

type WithUserProps = {
  user: BasicUser
}

const AvatarImg = styled.img<{size: number}>`
  height: ${props => props.size}rem;
  width: ${props => props.size}rem;
  border-radius:  ${props => props.size * 0.25}rem;
`

const BetweenRow = styled.div`
  padding: 0.5rem 0.5rem 0 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const PaddedBetweenRow = styled(BetweenRow)`
  padding: 0.25rem 0.25rem 0.25rem 0.5rem;
`

export const ButtonSignout: React.SFC = () => {
  const { signOut } = useAuthHandlers()
  return <button onClick={() => signOut()}>Sign Out</button>
}

const OffsetAvatarImg = styled(AvatarImg)`
  margin-bottom: -1rem;
`

const UserInfo: React.SFC<WithUserProps> = ({user}) =>
  user.photoURL ? <OffsetAvatarImg src={user.photoURL || ""} size={3}/> : <div>&nbsp;</div>

const ImpersonationBar: React.SFC = () => {
  return (
    <PaddedBetweenRow>
      Impersonate:
      <button onClick={() => impersonate('spotify:31janlt26cdyiecnqxi45pnab4eu')}>stevo</button>
      <button onClick={() => impersonate('spotify:12449097')}>alex</button>
      <button onClick={() => impersonate('spotify:124053034')}>liam</button>
      <button onClick={() => impersonate('spotify:earthtomegan')}>megan</button>
      <button onClick={() => impersonate('spotify:maleyfam')}>ben</button>
      <button onClick={() => impersonate('spotify:xnx2fj5o8x2fgl1hdr10jjars')}>test 1</button>
      <button onClick={() => impersonate('spotify:a0rcusksyscdoa1f7ylnot6c8')}>test 2</button>
      <button onClick={() => impersonate('spotify:yw19fznedr2b4dxo55cmjz11h')}>test 3</button>
    </PaddedBetweenRow>
  )
}

const Dropdown = styled.div<{open: boolean}>`
  position: absolute;
  opacity: ${({open}) => open ? '100' : '0'};
  visibility: ${({open}) => open ? 'visible' : 'hidden'};
  transition: all 0.5s;
  margin: 0;
  right: 0;
  padding: 0;
  z-index: 30;
  background-color: #AAA;
  & > * {
    position: relative;
    cursor: pointer;
  }
`

const DropdownMenu: React.SFC<{Component: React.SFC<{onClick: () => void}>}> = ({Component, children}) => {
  const [open, setOpen] = useState(false)
  console.log(open)
  return (
    <div>
      <Component onClick={() => setOpen(!open)}/>
      <Dropdown {...{open}}>
        {children}
      </Dropdown>
    </div>
  )
}
const FixedBar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  height: 3rem;
  width: 100%;
  overflow: visible;
  z-index: 20;
  background-color: #121519;

`

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  display: block;
`

const UserMenuButton: React.SFC<{onClick: () => void}> = ({onClick}) =>
  <IconButton {...{onClick}}><MenuIcon/></IconButton>

const UserMenu: React.SFC = () =>
  <DropdownMenu Component={UserMenuButton}>
     <ButtonSignout/>
  </DropdownMenu>

export const AuthedAppBar: React.SFC = () => {
  const { user } = useUser()
  if (!user) { return <></>}
  const qryArg = window.location.href.split('?')[1]
  return (
    <FixedBar>
      <BetweenRow>
        <UserInfo {...{user}}/>
        <UserMenu/>
      </BetweenRow>
      {qryArg == 'imp' && <ImpersonationBar/> || <></>}
    </FixedBar>
  )
}

