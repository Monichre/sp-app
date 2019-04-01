import React from 'react'
import { useUser, useAuthHandlers } from '../comp/FirebaseContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { Logo } from '../comp/Logo';

type WithUserProps = {
  user: firebase.User
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

export const AppBar: React.SFC = () => {
  const { user } = useUser()
  if (!user) { return <div>Logging in...</div>}
  return (
    <PaddedBetweenRow>
      <ButtonSignout/>
      <Logo size={2}/>
      <UserInfo {...{user}}/>
    </PaddedBetweenRow>
  )
}

