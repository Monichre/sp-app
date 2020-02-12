import * as React from "react";
import styled, { css } from "styled-components";

export const OpaqueBackground = styled.div`
  width: 100%;
  height: 100%vh;
  padding: 30px 0;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: "Source Sans Pro", sans-serif;
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
  padding: 20px;
  border-radius: 10px;
`;

export const TopFiveHeader = styled.div`
  text-align: center;
`;

export const LogoDiv = styled.img`
  width: 144px;
  margin: auto;
  padding-top: 34px;
`;

export const HorizontalRule = styled.hr`
  border-top: 1px solid white;
  opacity: 0.3;
`;
