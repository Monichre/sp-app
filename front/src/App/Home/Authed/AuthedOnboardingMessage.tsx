import React from 'react';
import styled from 'styled-components';
import { Loading } from '../../../shared/Loading';

const MessageBlock = styled.div`
  font-size: 2rem;
  padding: 4rem;
  line-height: 150%;
`

export const OnboardingMessage: React.SFC = () =>
  <MessageBlock>
    Capturing your most recent music stats from Spotify, starting with the last 50 songs you streamed. Watch these stats evolve as you keep listening.
    <Loading/>
  </MessageBlock>