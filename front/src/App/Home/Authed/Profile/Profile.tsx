import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { ButtonSignout, Container } from '../../../../shared/ui';

export const Profile: React.SFC<RouteComponentProps> = () =>
  <Container>
    <h1>Profile</h1>
    <ButtonSignout/>
  </Container>
