import { createGlobalStyle } from "styled-components"
import { BODY_FONT } from "../shared/media";

export const DASH_GREEN = `rgb(87, 192, 167)`
export const DASH_DARK = `rgba(0, 3, 6, 0.7)`
export const DASH_BLUE = `#99EEEE`
export const DASH_YELLOW = `#EEEE99`
export const DASH_PINK = `#EE9999`
export const DASH_PURPLE = `#9999EE`


/*
position: absolute;
width: 90px;
height: 90px;
left: 975px;
top: 621px;

background: #DD9999;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 975px;
top: 531px;

background: #DDBB99;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 975px;
top: 441px;

background: #DDDD99;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 975px;
top: 891px;

background: #99DDDD;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 975px;
top: 801px;

background: #99BBDD;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 975px;
top: 711px;

background: #9999DD;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1055px;
top: 621px;

background: #EE9999;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1055px;
top: 531px;

background: #EECC99;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1055px;
top: 441px;

background: #EEEE99;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1055px;
top: 891px;

background: #99EEEE;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1055px;
top: 801px;

background: #99CCEE;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1055px;
top: 711px;

background: #9999EE;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1135px;
top: 621px;

background: #FF9999;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1135px;
top: 531px;

background: #FFCC99;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1135px;
top: 441px;

background: #FFFF99;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1135px;
top: 891px;

background: #99FFFF;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1135px;
top: 801px;

background: #99CCFF;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1135px;
top: 711px;

background: #9999FF;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1215px;
top: 621px;

background: #EE8888;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1215px;
top: 531px;

background: #EEBB88;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1215px;
top: 441px;

background: #EEEE88;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1215px;
top: 891px;

background: #88EEEE;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1215px;
top: 801px;

background: #88BBEE;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1215px;
top: 711px;

background: #8888EE;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1295px;
top: 622px;

background: #FF7777;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1295px;
top: 532px;

background: #FFBB77;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1295px;
top: 442px;

background: #FFFF77;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1295px;
top: 892px;

background: #77FFFF;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1295px;
top: 802px;

background: #77BBFF;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1295px;
top: 712px;

background: #7777FF;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1375px;
top: 622px;

background: #FF6666;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1375px;
top: 532px;

background: #FFAA66;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1375px;
top: 442px;

background: #FFFF66;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1375px;
top: 892px;

background: #66FFFF;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1375px;
top: 802px;

background: #66AAFF;
transform: rotate(90deg);




position: absolute;
width: 90px;
height: 90px;
left: 1375px;
top: 712px;

background: #6666FF;
transform: rotate(90deg);
Help Center
Keyboard Shortcuts
⌃⇧?
Community Forum
Video Tutorials
Reset Onboarding
Release Notes
Legal Summary
Get Help


*/

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
  .ant-card-head-title {
    color: #fff;
  }
  .ant-card, .ant-card.ant-card-bordered {
    /* background-color: rgba(216,216,216,.025); */
    width: 100%;
  }
  .ant-card-body {
    background-color: rgba(216,216,216,.025);
    width: 100%;
        border-radius: 12px;
        border-bottom: none;
        padding: 10px;
  }

.ant-list {
  /* background-color: #030616!important; */
  background: transparent!important;

  &#artistTopListeners {
    .ant-list-item {
      flex-direction: column!important;
      align-content: flex-start;
      border-bottom: none;
      .ant-list-item {
        border-bottom: none;
        /* background-color: rgba(216,216,216,.025);
        border-radius: 12px;
        border-bottom: none;
        padding: 10px; */
      }
    }

  }

  &#SideBarAchievements {
    .ant-list-item {
      border-bottom: none;
      background-color: rgba(216,216,216,.025);
      border-radius: 12px;

      &.lifetime {

        h4 {
          border-bottom: 1px solid #ffa726;
          width: max-content;
        }
      
      }
      }
    }
  }

  &#achievementHoldersList {
    .ant-list-item {
      .ant-list-item {
        /* background-color: rgba(216,216,216,.025);
        border-radius: 12px;
        border-bottom: none;
        padding: 10px; */
      }

    }

  }


  .ant-list-footer {
    display: none;
  }

  .ant-list-items {
    .ant-list-item {
      position: relative;
      display: flex;
      flex-direction: row!important;
      &.notLifeTimeAchievement {
        .ant-list-item-extra {
          margin-top: 40px;
          .ant-carousel .slick-dots-bottom {
            bottom: -5px;
          }
        }
      }
      .ant-list-item-main, .ant-list-item-extra {
          margin-left: 0!important;
          width: 48%!important;
      }
      .ant-list-item-main {
        padding: 10px;
      }
      .ant-list-item-action {
        margin-left: 48px;
      }

      .ant-list-item-extra {
        .slick-dots.slick-dots-bottom {
          li {
            button {
              width: 5px;
              height: 5px;
              background-image: linear-gradient(to bottom,#e64a19 0%,#ffa726 100%);
              border-radius: 50%;
            }

            &.slick-active {
              position: relative;
              top: 1px;
              button {
              width: 16px;
              height: 3px;
              background-image: linear-gradient(to bottom,#e64a19 0%,#ffa726 100%);
              opacity: 1;
              border-radius: 5px;
            }
            }
          }
        }
      }


    }
  }
  
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
  text-align: left!important;
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
`