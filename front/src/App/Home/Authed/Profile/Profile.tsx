import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { ButtonSignout, Container } from '../../../../shared/ui';
import { ProfileCard } from './ProfileCard';
import { Flex, Box } from 'rebass'

const Placement = styled.div`
position: absolute;
top: 30px;
right: 30px;


@media screen and (max-width: 1000px) {
  position: static;
}

`

export const Profile: React.SFC<RouteComponentProps & { user: any }> = ({ user }) => {
  //@ts-ignore
  window.Intercom('trackEvent', 'page-navigation', {
    name: user.displayName || 'N/A', // Full name
    email: user.email || 'N/A', // Email address
    user_id: user.uid,
    avatar: {
      "type": "avatar",
      "image_url": user.photoURL
    }, // current_user_id
    page: 'Profile'
  })

  return (
    <Container padded>
      <Flex
        flexWrap='wrap'
        justifyContent='space-between'
        sx={{
          minHeight: '100vh'
        }}>
        <Box>
          <ProfileCard user={user} />
        </Box>
        <Box>
          <Placement><ButtonSignout /></Placement>
        </Box>

      </Flex>

    </Container>


  )
}

