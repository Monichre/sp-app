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
  /* padding: 0.85rem 1rem; */
  background-color: rgba(216,216,216,.05);

  ${AvatarLink} {
      padding: 0;
      flex-direction: row!important;
  }

  ${AvatarBg} {
      position: relative!important;
      margin-right: 10px;
  }

  .ant-menu-horizontal {
    background: transparent;
    color: #fff;
    border: none!important;
    &.ant-menu-light.ant-menu-root.ant-menu-horizontal {
      line-height: normal;
    }

    .ant-menu-item {
      padding: 0.85rem 1rem;
      &:hover, &.ant-menu-item-selected {
        color: #64d6ee;
        border-bottom: 2px solid #64d6ee;

      }
      &:nth-of-type(1) {
        padding-left: 0;
      }
      /* display: flex; */
      a {
        margin-right: 5px;
        font-size: 14px;
        width: auto;
        display: flex;
        height: 24px;
        width: 24px;
        overflow: visible;
        position: relative;
        @media screen and (max-width: 1000px) {
          width: auto;
          height: auto;
        }
        div {
          font-size: 14px;
        }
        .sc-hzDkRC {
          position: absolute!important;
          margin-right: 10px;
          height: 40px;
          width: 40px;
          @media screen and (max-width: 1000px) {
              position: relative!important;
              height: 32px;
              width: 32px;
              top: 4px;
            }
        }

       

      }
      .sc-iAyFgw.gPdKCG {
        display: inline-block;
        height: 24px;
        margin-right: 5px;
        width: 24px;
      }
      svg {
        margin-right: 5px;
      }
    }
  }
`
