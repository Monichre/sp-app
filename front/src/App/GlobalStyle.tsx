import { createGlobalStyle } from "styled-components"
import { BODY_FONT } from "../shared/media";

// export const DASH_GREEN = `rgb(87, 192, 167)`
// export const DASH_DARK = `rgba(0, 3, 6, 0.7)`
// export const DASH_BLUE = `#99EEEE`
// export const DASH_YELLOW = `#EEEE99`
// export const DASH_PINK = `#EE9999`
// export const DASH_PURPLE = `#9999EE`

/*
  BLUES: 22284A, 1D223F, 191D36, 15192E, 121527, 0F1221, 0C0F1B, 0A0C16, 080A12, 07080F 06070C

  Some other ones...
  background: #DD9999;
background: #DDBB99;
background: #DDDD99;
background: #99DDDD;
background: #99BBDD;
background: #9999DD;
background: #EE9999;
background: #EECC99;
background: #EEEE99;
background: #99EEEE;
background: #99CCEE;
background: #9999EE;
background: #FF9999;
background: #FFCC99;
background: #FFFF99;
background: #99FFFF;
background: #99CCFF;
background: #9999FF;
background: #EE8888;
background: #EEBB88;
background: #EEEE88;
background: #88EEEE;
background: #88BBEE;
background: #8888EE;
background: #FF7777;
background: #FFBB77;
background: #FFFF77;
background: #77FFFF;
background: #77BBFF;
background: #7777FF;
background: #FF6666;
background: #FFAA66;
background: #FFFF66;
background: #66FFFF;
background: #66AAFF;
background: #6666FF;
*/

export const APP_BG_COLOR = `#030616`
export const APP_BLUE = `rgba(100,214,238,1)`
export const APP_BLUE_TRANSPARENT = `rgba(100,214,238,1)`
export const APP_BG_LIGHTEN = `rgba(216,216,216,.055)`
export const APP_BORDER_RADIUS_LG = `12px`
export const APP_BORDER_RADIUS_MD = `6px`
export const APP_BORDER_RADIUS_SM = `3px`


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
    overflow-x: hidden;
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
  .ant-popover {
  z-index: 2000!important;
}

  .ant-drawer-body {
    height: 100vh;
    overflow: scroll;
    padding: 0px!important;

    border-left: 1px solid rgba(255,255,255,.1);

  }
  .ant-drawer-close {
    color: #fff!important;
    left: -20px;
    display: none!important;
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

    .ant-popover-inner-content {
      background-color: #030616!important;
  background: #030616!important;
    }

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

  background-color: rgba(216,216,216,.055)!important;
  

}
.ant-tabs .ant-tabs-left-content {
  border-left: none!important;
}
.ant-tabs .ant-tabs-left-bar {
  border-right: none!important;
  padding-right: 10px;
  /* background-color: rgba(216,216,216,.075); */

}
.ant-collapse-item {
  border: none!important;
  background-color: rgba(216,216,216,.015);
  margin: 10px 0 !important;
}
.ant-collapse > .ant-collapse-item > .ant-collapse-header {
  color: #fff!important;
}
.ant-tabs-tab {
  color: #fff;
  text-align: center!important;
}
.ant-tabs .ant-tabs-left-bar .ant-tabs-tab, .ant-tabs .ant-tabs-right-bar .ant-tabs-tab, .ant-tabs-tab-active ant-tabs-tab {
  margin: 0!important;
  padding: 24px!important;
}
.ant-tabs .ant-tabs-left-content {
    padding-left: 0!important;
  }

  .ant-collapse, .ant-collapse-content {
    background: transparent!important;
    background-color: none!important;
    color: #fff;
    border: none!important;

    .ant-collapse-content-box {
      /* background-color: rgba(216,216,216,.055); */
    }
  }
  .ant-popover-content .ant-popover-inner-content {
    border-radius: 12px;
  }
`