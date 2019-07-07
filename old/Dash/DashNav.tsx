import React from 'react';
import styled from 'styled-components'
import { Info, History } from 'grommet-icons';
import { NavLink } from 'react-router-dom';

const NavBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
`

const NavTab = styled(NavLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.25rem;
  background-color: #030616;
  color: #fff;
  text-decoration: none;
  padding: 1rem;
  transition: all 0.25s linear;
  &.active {
    /* background-color: #555; */
    color: #FFF;
  }
  // padding-top: 1rem;
  & > * {
    margin-right: 1rem;
  }
  &:nth-child(1) {
    border-radius: 0.5rem 0 0 0.5rem;
  }
  &:nth-child(2) {
    border-radius: 0 0.5rem 0.5rem 0;
    justify-content: flex-end;
  }
`

export const DashNav: React.SFC = () =>
  <NavBar>
    <NavTab to='/dash/insights'><Info color='white'/><div>Insights</div></NavTab>
    <NavTab to='/dash/history'><div>History</div><History color='white'/></NavTab>
  </NavBar>