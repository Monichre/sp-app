import * as React from "react";
import styled, { css } from "styled-components";

export const OpaqueBackground = styled.div`
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: "Source Sans Pro", sans-serif;
  overflow: hidden;
`;

export const CloseButton = styled.div`
  width: 50px;
  height: 50px;
  padding: 0;
  margin: 0;
  background: green;
  display: flex;
`;

export const TopFiveParentDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-size: cover;
  background: rgb(246, 133, 31);
  background: linear-gradient(
    0deg,
    rgba(246, 133, 31, 1) 0%,
    rgba(229, 76, 25, 1) 100%
  );
  width: 80%;
  max-width: 414px;
  // max-height: 90vh;
  padding: 20px;
  border-radius: 10px;
`;

export const TopFiveHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

export const Headline = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

export const DateRange = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 400;
`;

export const LogoDiv = styled.img`
  width: 144px;
  margin: auto;
  padding-top: 35px;
`;

export const TitleHr = styled.hr`
  border-top: 0.5px solid white;
  opacity: 0.3;
  margin: 5px 0;
`;

export const HorizontalRule = styled.hr`
  border-top: 0.5px solid white;
  opacity: 0.3;
  margin: 10px 0 15px 0;
  // margin-bottom: 10px;
`;
