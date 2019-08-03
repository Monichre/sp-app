import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';


/**
 *
 * cc: Finish This; Reference https://dev.to/jsmanifest/build-a-stunning-breadcrumb-component-in-react-with-plain-css-3phh
 *
 */


const Bread = styled.div`
    display: flex;
`

export interface BreadCrumbsProps {
    children: any
}
 
export const BreadCrumbs: React.SFC<BreadCrumbsProps> = ({ children }) => {
    return (<Bread>{children}</Bread> );
}
 
