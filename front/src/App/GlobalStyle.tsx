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