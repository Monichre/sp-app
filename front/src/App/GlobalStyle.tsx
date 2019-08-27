import { createGlobalStyle } from "styled-components"
import { BODY_FONT } from "../shared/media";

export const GlobalStyle = createGlobalStyle`
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}
  html {
    height: 100%;
    background-color: #030616;
    
  }
  #root {
    height: auto!important;
    min-height: 100vh;
    background-color: #030616;
  }
  body {
    font-family: "${BODY_FONT}", sans-serif!important;
    color: #fff;
    background-color: #030616;
    background-image: url(/dots.png);
    background-repeat: repeat;
    background-size: 20px 20px;
    background-blend-mode: color-dodge;
    height: 100vh;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    z-index: 10;

    
  }
  a, h1, h2, p {
    color: white!important;
  }

  h1, h2 {
    margin: 0;
  }
.ant-list {
  /* background-color: #030616!important; */
  background: transparent!important
  
}


.ant-popover-arrow {
  border-right-color: #64d6ee!important;
    border-bottom-color: #64d6ee!important;
}
.ant-popover-title {
  background-color: #030616!important;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background: #030616!important;
  border-bottom: 1px solid rgba(216,216,216,.05);
  color: #fff!important;
}
.ant-popover-content {
  background-color: #030616!important;
  background: #030616!important;
  border-radius: 12px;
    border: 1px solid #64d6ee;

}
.ant-list-item-meta-title, .ant-list-item-meta-description, .ant-popover-inner-content {
  color: #fff!important;
}


.ant-avatar.ant-avatar-lg.ant-avatar-circle.ant-avatar-image {
  position: relative;

  &::before {
    border-radius: 50%;
    content: '';
    background-image: linear-gradient(to bottom,#e64a19 0%,#ffa726 100%);
    height: 3.2rem;
    width: 3.2rem;
    position: absolute;
    z-index: -1;
  }
}

 .ant-popover-inner {

  background-color: rgba(216,216,216,.015)!important;

  /* &::before {
        position: absolute;
        top: 0;
        content: '';
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(216,216,216,.015);
    } */
}
`