import React from 'react';
import styled from 'styled-components'

export const VerticalSpacer = styled.div<{height: string}>`
  display: block;
  content: "";
  height: ${({height}) => height};
`