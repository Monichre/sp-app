import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { ButtonSignout, Container } from '../../../../shared/ui';
import { ProfileCard } from './ProfileCard';
import {Flex, Box} from 'rebass'

const Placement = styled.div`
position: absolute;
top: 30px;
right: 30px;

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
    sx={{
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
    <Box
      sx={{
        display: 'grid',
        flex: 1,
        minHeight: '100vh',
        gridTemplateAreas: [
          '"long-box long-box" "left-box right-box" "wide-box wide-box"',
          '"long-box long-box left-box right-box" "long-box long-box wide-box wide-box"'
        ],
        gridTemplateColumns: [
          'repeat(2, 1fr)',
          'repeat(4, 1fr)'
        ],
        gridTemplateRows: [
          '2fr 1fr 1fr',
          'none'
        ],
        gridGap: 20,
        margin: 20
      }}>
      <Box
        sx={{
          flex: 1,
          gridArea: 'long-box'
        }}>
        <ProfileCard user={user} />
      </Box>
      <Box
        sx={{
          flex: 1,
          gridArea: 'left-box'
        }}>
        
      </Box>
      <Box
        sx={{
          flex: 1,
          gridArea: 'right-box'
        }}>
        <Placement><ButtonSignout /></Placement>
      </Box>
      <Box
        sx={{
          flex: 1,
          gridArea: 'wide-box'
        }}>
        
      </Box>
    </Box>
  </Flex>
  
    </Container>
  
  
  )
}
  
