import React from 'react'
import { useUser, useAuthHandlers, BasicUser, impersonate } from '../comp/FirebaseContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { Logo } from '../comp/Logo';

type WithUserProps = {
  user: BasicUser
}

const AvatarImg = styled.img<{size: number}>`
  height: ${props => props.size}rem;
  width: ${props => props.size}rem;
  border-radius:  ${props => props.size * 0.25}rem;
  border: 1px solid cyan;
`

const BetweenRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const PaddedBetweenRow = styled(BetweenRow)`
  padding: 0.25rem 0.25rem 0.25rem 0.5rem;
`

const ButtonSignout: React.SFC = () => {
  const { signOut } = useAuthHandlers()
  return <button onClick={() => signOut()}>Sign Out</button>
}

const UserInfo: React.SFC<WithUserProps> = ({user}) =>
  <AvatarImg src={user.photoURL || ""} size={2.5}/>

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

export const AppBar: React.SFC = () => {
  const { user } = useUser()
  if (!user) { return <div>Logging in...</div>}
  const qryArg = window.location.href.split('?')[1]
  return (
    <>
      <PaddedBetweenRow>
        <ButtonSignout/>
        <Logo size={2}/>
        <UserInfo {...{user}}/>
      </PaddedBetweenRow>
      {qryArg == 'imp' && <ImpersonationBar/> || <></>}
    </>
  )
}

