import { Popover, List, Avatar, Card } from 'antd';
import styled from 'styled-components';
import { APP_BLUE_TRANSPARENT, APP_BORDER_RADIUS_MD } from '../GlobalStyle';



export const ListCard = styled(Card)`
  /* border: 2px solid #ddd;
  border-radius: 6px;
  back */

  .ant-card-head-title {
    color: #fff;
    padding: 14px 9px;
  }
  .ant-card {
    background-color: ${APP_BLUE_TRANSPARENT};
    border-radius: ${APP_BORDER_RADIUS_MD};
    .ant-list-item {
      background: transparent!important;
    }
  }
  .ant-card, .ant-card.ant-card-bordered {
    /* background-color: rgba(216,216,216,.025); */
    /* background-color: ${APP_BLUE_TRANSPARENT}; */
    background: transparent!important;
    border: none;
    border-radius: ${APP_BORDER_RADIUS_MD}!important;
    width: 100%;
  }
  .ant-card-body {
    /* background-color: rgba(216,216,216,.025); */
    background: transparent!important;
    width: 100%;
        border-radius: 12px;
        border-bottom: none;
        padding: 18px;
  }
`

export const ListStyle = styled(List)`

${ListCard} {
  background: transparent!important;
  border: none!important;
  width: 100%;
 


}

.ant-list {
  /* background-color: #030616!important; */
  background: transparent!important;

  &#artistTopListeners {
    .ant-list-item {
      flex-direction: column!important;
      align-content: flex-start;
      border-bottom: none;
      background-color: rgba(216,216,216,.025);
      border-bottom: none;
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




  .ant-list-footer {
    display: none;
  }

  #achievementHoldersList {

  }
  .ant-list-items {
    .ant-list-item {
      position: relative;
      display: flex;
      flex-direction: row!important;
      background-color: rgba(216,216,216,.055);
      padding: 0!important;
      border-radius: ${APP_BORDER_RADIUS_MD}!important;
      margin-bottom: 18px;
      border-bottom: none!important;

      /* Nested List Item */ 
        .ant-list-item {
          background: transparent!important;
          background-color: transparent;
          margin-bottom: 0;
        }
      }

  }
      .ant-card-head {
        padding: 0;
      }

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


.ant-list {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: 'tnum';
          font-feature-settings: 'tnum';
  position: relative;
}
.ant-list * {
  outline: none;
}
.ant-list-pagination {
  margin-top: 24px;
  text-align: right;
}
.ant-list-more {
  margin-top: 12px;
  text-align: center;
}
.ant-list-more button {
  padding-right: 32px;
  padding-left: 32px;
}
.ant-list-spin {
  min-height: 40px;
  text-align: center;
}
.ant-list-empty-text {
  padding: 16px;
  color: rgba(0, 0, 0, 0.25);
  font-size: 14px;
  text-align: center;
}
.ant-list-items {
  margin: 0;
  padding: 0;
  list-style: none;
}
.ant-list-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  padding: 12px 0;
}
.ant-list-item-content {
  color: rgba(0, 0, 0, 0.65);
}
.ant-list-item-meta {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
      -ms-flex: 1;
          flex: 1;
  -webkit-box-align: start;
      -ms-flex-align: start;
          align-items: flex-start;
  font-size: 0;
}
.ant-list-item-meta-avatar {
  margin-right: 16px;
}
.ant-list-item-meta-content {
  -webkit-box-flex: 1;
      -ms-flex: 1 0;
          flex: 1 0;
}
.ant-list-item-meta-title {
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 22px;
}
.ant-list-item-meta-title > a {
  color: rgba(0, 0, 0, 0.65);
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}
.ant-list-item-meta-title > a:hover {
  color: #1890ff;
}
.ant-list-item-meta-description {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
}
.ant-list-item-action {
  -webkit-box-flex: 0;
      -ms-flex: 0 0 auto;
          flex: 0 0 auto;
  margin-left: 48px;
  padding: 0;
  font-size: 0;
  list-style: none;
}
.ant-list-item-action > li {
  position: relative;
  display: inline-block;
  padding: 0 8px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 22px;
  text-align: center;
  cursor: pointer;
}
.ant-list-item-action > li:first-child {
  padding-left: 0;
}
.ant-list-item-action-split {
  position: absolute;
  top: 50%;
  right: 0;
  width: 1px;
  height: 14px;
  margin-top: -7px;
  background-color: #e8e8e8;
}
.ant-list-header {
  background: transparent;
}
.ant-list-footer {
  background: transparent;
}
.ant-list-header,
.ant-list-footer {
  padding-top: 12px;
  padding-bottom: 12px;
}
.ant-list-empty {
  padding: 16px 0;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  text-align: center;
}
.ant-list-split .ant-list-item {
  border-bottom: 1px solid #e8e8e8;
}
.ant-list-split .ant-list-item:last-child {
  border-bottom: none;
}
.ant-list-split .ant-list-header {
  border-bottom: 1px solid #e8e8e8;
}
.ant-list-loading .ant-list-spin-nested-loading {
  min-height: 32px;
}
.ant-list-something-after-last-item .ant-spin-container > .ant-list-items > .ant-list-item:last-child {
  border-bottom: 1px solid #e8e8e8;
}
.ant-list-lg .ant-list-item {
  padding-top: 16px;
  padding-bottom: 16px;
}
.ant-list-sm .ant-list-item {
  padding-top: 8px;
  padding-bottom: 8px;
}
.ant-list-vertical .ant-list-item {
  -webkit-box-align: initial;
      -ms-flex-align: initial;
          align-items: initial;
}
.ant-list-vertical .ant-list-item-main {
  display: block;
  -webkit-box-flex: 1;
      -ms-flex: 1;
          flex: 1;
}
.ant-list-vertical .ant-list-item-extra {
  margin-left: 40px;
}
.ant-list-vertical .ant-list-item-meta {
  margin-bottom: 16px;
}
.ant-list-vertical .ant-list-item-meta-title {
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  line-height: 24px;
}
.ant-list-vertical .ant-list-item-action {
  margin-top: 16px;
  margin-left: auto;
}
.ant-list-vertical .ant-list-item-action > li {
  padding: 0 16px;
}
.ant-list-vertical .ant-list-item-action > li:first-child {
  padding-left: 0;
}
.ant-list-grid .ant-list-item {
  display: block;
  max-width: 100%;
  margin-bottom: 16px;
  padding-top: 0;
  padding-bottom: 0;
  border-bottom: none;
}
.ant-list-item-no-flex {
  display: block;
}
.ant-list:not(.ant-list-vertical) .ant-list-item-no-flex .ant-list-item-action {
  float: right;
}
.ant-list-bordered {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
.ant-list-bordered .ant-list-header {
  padding-right: 24px;
  padding-left: 24px;
}
.ant-list-bordered .ant-list-footer {
  padding-right: 24px;
  padding-left: 24px;
}
.ant-list-bordered .ant-list-item {
  padding-right: 24px;
  padding-left: 24px;
  border-bottom: 1px solid #e8e8e8;
}
.ant-list-bordered .ant-list-pagination {
  margin: 16px 24px;
}
.ant-list-bordered.ant-list-sm .ant-list-item {
  padding-right: 16px;
  padding-left: 16px;
}
.ant-list-bordered.ant-list-sm .ant-list-header,
.ant-list-bordered.ant-list-sm .ant-list-footer {
  padding: 8px 16px;
}
.ant-list-bordered.ant-list-lg .ant-list-header,
.ant-list-bordered.ant-list-lg .ant-list-footer {
  padding: 16px 24px;
}
@media screen and (max-width: 768px) {
  .ant-list-item-action {
    margin-left: 24px;
  }
  .ant-list-vertical .ant-list-item-extra {
    margin-left: 24px;
  }
}
@media screen and (max-width: 576px) {
  .ant-list-item {
    -ms-flex-wrap: wrap;
        flex-wrap: wrap;
  }
  .ant-list-item-action {
    margin-left: 12px;
  }
  .ant-list-vertical .ant-list-item {
    -ms-flex-wrap: wrap-reverse;
        flex-wrap: wrap-reverse;
  }
  .ant-list-vertical .ant-list-item-main {
    min-width: 220px;
  }
  .ant-list-vertical .ant-list-item-extra {
    margin: auto auto 16px;
  }
}
  }
`
