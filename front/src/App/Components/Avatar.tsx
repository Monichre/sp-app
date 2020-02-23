import * as React from "react";
import { Component } from "react";
import { Popover, List, Avatar as AntAvatar, Icon } from "antd";
import Img from "react-image";
import styled from "styled-components";
import fallbackAvatar from "../../shared/images/fallback-avatar.svg";

const SoundprufAvatar = styled(Img)`
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: "tnum";
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  overflow: hidden;
  color: #fff;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
  background: #ccc;
  width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 50%;
`;

export interface AvatarProps {
  src: string | null;
}

export const Avatar: React.SFC<AvatarProps> = ({ src }) => {
  return (
    <SoundprufAvatar
      className="SoundprufAvatar"
      src={[src, fallbackAvatar]}
      loader={<Icon type="loading" />}
    />
  );
};

export const AvatarStyle = styled(AntAvatar)`
  .ant-avatar {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    -webkit-font-feature-settings: "tnum";
    font-feature-settings: "tnum";
    position: relative;
    display: inline-block;
    overflow: hidden;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    vertical-align: middle;
    background: #ccc;
    width: 32px;
    height: 32px;
    line-height: 32px;
    border-radius: 50%;
  }
  .ant-avatar-image {
    background: transparent;
  }
  .ant-avatar-string {
    position: relative;
    left: auto;
    /* -webkit-transform-origin: 0 center;
		-ms-transform-origin: 0 center; */
    transform-origin: none;
  }
  .ant-avatar.ant-avatar-icon {
    font-size: 18px;
  }
  .ant-avatar-lg {
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
  }
  .ant-avatar-lg-string {
    position: relative;
    /* left: 50%;
		-webkit-transform-origin: 0 center;
		-ms-transform-origin: 0 center; */
    transform-origin: none;
  }
  .ant-avatar-lg.ant-avatar-icon {
    font-size: 24px;
  }
  .ant-avatar-sm {
    width: 24px;
    height: 24px;
    line-height: 24px;
    border-radius: 50%;
  }
  .ant-avatar-sm-string {
    position: relative;
    left: auto;

    transform-origin: none;
  }
  .ant-avatar-sm.ant-avatar-icon {
    font-size: 14px;
  }
  .ant-avatar-square {
    border-radius: 4px;
  }
  .ant-avatar > img {
    display: block;
    width: 100%;
    height: 100%;
  }
`;
