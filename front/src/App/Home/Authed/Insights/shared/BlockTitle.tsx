import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TITLE_FONT } from '../../../../../shared/media';

export const BlockTitleMore = styled.div`
  text-transform: none;
  text-decoration: underline;
  font-size: 1.0rem;
  color: #64d6ee;
  // font-weight: bold;
  margin-left: 0.5rem;
  opacity: 0.6;
  &:hover {
    opacity: 1.0;
  }
`

const BlockTitleStyles = `
// font-family: ${TITLE_FONT}
text-decoration: none;
padding-top: 2rem;
display: flex;
flex-direction: row;
align-items: flex-end;
flex: 1;
color: #999;
text-transform: uppercase;
font-weight: 500;
font-size: 1.2rem;
padding-bottom: 0.25rem;
margin-bottom: 1rem;
border-bottom: 1px solid #666;
`

const BlockTitleView = styled.div<{color?: string}>`
  ${BlockTitleStyles}
// padding-top: 2rem;
// display: block;
// flex: 1;
// color: #999;
// text-transform: uppercase;
// font-weight: 500;
// font-size: 1.2rem;
// padding-bottom: 0.25rem;
// margin-bottom: 1rem;
// // border-bottom: 1px solid ${({color}) => color || '#64d6ee'};
// // border-top: 1px solid #AAA;
// border-bottom: 1px solid #666;
`

const BlockTitleLink = styled(Link)`
  ${BlockTitleStyles}
`

export const BlockTitle: React.SFC<{to?: string}> = ({children, to}) =>
  to ? <BlockTitleLink {...{to}}>{children}</BlockTitleLink> : <BlockTitleView>{children}</BlockTitleView>