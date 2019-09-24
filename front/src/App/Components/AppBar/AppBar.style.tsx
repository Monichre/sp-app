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
  background-color: rgba(216,216,216,.05);
  
  .largeScreen {
    display: block;
    width: calc(100vw - 200px);
    @media screen and (max-width: 1000px) {
      display: none;
	  }
  }

  ${AvatarLink} {
      padding: 0;
      flex-direction: row!important;
      &#AppBarAvatarLink {

        @media screen and (max-width: 600px){
          margin-right: 0px;
        }

        #AppBarAvatar {
          height: 35px;
          margin-right: 0px;
          width: 35px;
        @media screen and (max-width: 600px) {
          height: 26px;
          margin-right: 0px;
          width: 26px;
        }
      }
      }

  }

  ${AvatarBg} {
      position: relative!important;
      margin-right: 10px;
  }

  

  .ant-menu {
    background: transparent;
    color: #fff;
    border: none!important;
    &.ant-menu-light.ant-menu-root.ant-menu-horizontal {
      line-height: normal;
    }

    .ant-menu-item {
      padding: 0.85rem 1rem;
      vertical-align: middle!important;
      @media screen and (max-width: 600px) {
        padding: 2px;
        margin: 0 5px;
      }
      &:hover, &.ant-menu-item-selected {
        color: #64d6ee;
        border-bottom: 2px solid #64d6ee;

      }
      &:nth-of-type(1) {
        padding-left: 0;
      }
      /* display: flex; */
      a {
        
        font-size: 14px;
        width: auto;
        display: flex;
   
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
          /* position: absolute!important; */
          margin-right: 10px;
          height: 40px;
          width: 40px;
          @media screen and (max-width: 1000px) {
              position: relative!important;
              height: 32px;
              width: 32px;
              top: 4px;
            }
            @media screen and (max-width: 600px) {
              margin-left: 10px;
              margin-right: 0;
            }
        }
      }
      .sc-iAyFgw.gPdKCG {
        display: inline-block;
        height: 24px;
        margin-right: 5px;
        width: 24px;

        @media screen and (max-width: 600px) {
          height: 24px;
          margin: 0;
          width: 28px;
        }
      }

      svg {
        margin-right: 5px;
        @media screen and (max-width: 600px) {
          margin-right: 0;
          height: 24px;
        }
      }
    }
  }


  .smallScreen  {
    display: none;
    @media screen and (max-width: 1000px) {
      display: block;
      width: 100vw;
	  }

    
      .ant-menu-item {
        @media screen and (max-width: 600px) {
        padding: 2px;
      }
    }
	
  }
`
