import React from 'react';
import styled from 'styled-components'
import { useUser, useAuthHandlers, BasicUser, impersonate } from '../App/FirebaseContext';

export const Button = styled.button`
  background-color: #030616;
  border: 1px solid #64d6ee;
  border-radius: 0.5rem;
  color: #64d6ee;
  font-weight: bold;
  font-size: 1.25rem;
  padding: 1rem;
`

export const ButtonSignout: React.SFC = () => {
  const { signOut } = useAuthHandlers()
  return <Button onClick={() => signOut()}>Sign Out</Button>
}

export const Container = styled.div`
  margin: 0rem 1rem;
`