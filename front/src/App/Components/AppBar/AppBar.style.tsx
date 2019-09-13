import styled from 'styled-components';
import { NavPrimaryLink } from '../../Home/Authed/NavMenu';
import { AvatarBg } from '../Elements';

export const AvatarLink = styled(NavPrimaryLink)`
/* border-top: 1px solid rgba(255,255,255,.1);
border-bottom: 1px solid rgba(255,255,255,.1);
background-color: rgba(216,216,216,.05); */
/* padding: .5rem; */
position: relative;

`

export const NavLabel: any = styled.div`

`

export const HeaderBar = styled.div`
  width: 100%;
  padding: 0.85rem 1rem;
  background-color: rgba(216,216,216,.05);

  ${AvatarLink} {
      padding: 0;
      flex-direction: row!important;
  }

  ${AvatarBg} {
      position: relative!important;
      margin-right: 10px;
  }
`
