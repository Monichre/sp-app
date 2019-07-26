import React from 'react';
import styled from 'styled-components'
import { Previous } from 'grommet-icons';

const Back: any = styled(Previous)`
  cursor: pointer;
`
export const BackLink: React.SFC = () =>
  <Back onClick={() => window.history.back()} color='white' size='3rem'/>