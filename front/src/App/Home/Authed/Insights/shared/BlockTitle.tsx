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
color: #fff;
text-transform: uppercase;
font-weight: 500;
font-size: 1.2rem;
padding-bottom: 0.25rem;
margin-bottom: 1rem;
border-bottom: 1px solid rgba(255, 255, 255, .1);
`

const BlockTitleView = styled.div<{color?: string}>`
  ${BlockTitleStyles}
// padding-top: 2rem;
// display: block;
// flex: 1;
// color: #fff;
// text-transform: uppercase;
// font-weight: 500;
// font-size: 1.2rem;
// padding-bottom: 0.25rem;
// margin-bottom: 1rem;
// // border-bottom: 1px solid ${({color}) => color || '#64d6ee'};
// // border-top: 1px solid #AAA;
// border-bottom: 1px solid rgba(216, 216, 216, .05);
`

const BlockTitleLink = styled(Link)`
  ${BlockTitleStyles}
`

export const SeeAllLinkInner: any = styled.div`
   position: absolute;
    top: 0;
    right: 0;
    z-index: 3;
    -webkit-transition: .4s ease;
    transition: .4s ease;
    padding-bottom: 6px;
    padding-left: 6px;
    color: #fff;
    height: 2.5em;
    width: 2.5em;
    -webkit-transform-style: preserve-3d;
    -ms-transform-style: preserve-3d;
    transform-style: preserve-3d;
    border-radius: 0 0% 100% 0;

        display: flex;
    justify-content: center;
    align-items: center;
    
`

export const SeeAllLink: any = styled(Link)`

  height: 2.5em;
  transition: all .4s ease;
  width: 2.5em;
  top: 0;
  right: 0;
  position: absolute;
  background-color: rgba(216,216,216,.05);
  /* background-image: linear-gradient(to bottom,#64d6ee 0%,#ffa726 100%); */
  border-radius: 0 0% 0% 100%;

&:hover {
  background-color: rgba(216,216,216,.08);
}

a {
  position: absolute;
}

`

export const SeeAllIcon: any = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64d6ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-arrow-up-right"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
)


export const BlockTitle: React.SFC<{to?: string}> = ({children, to}) =>
  to ? <BlockTitleLink {...{to}}>{children}</BlockTitleLink> : <BlockTitleView>{children}</BlockTitleView>