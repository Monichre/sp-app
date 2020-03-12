import * as React from "react";
import styled, { css } from "styled-components";

export const OpaqueBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2147483001;
  width: 100vw;
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

export const ModalWrapper = styled.div`
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  width: 85%;
  max-width: 375px;
`;

export const TipAndCloseWrapper = styled.div`
  padding: 10px 0 0 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 414px;
`;

export const ShareTip = styled.p`
  color: white;
  font-size: 16px;
  margin-bottom: 0;
  padding-right: 10px;
`;

export const CloseButton = styled.div`
  width: 25px;
  height: 25px;
  padding: 0;
  margin: 0 0 0 auto;
  cursor: pointer;
  display: flex;
  position: relative;
  transform: rotate(45deg);
`;

export const Hx = styled.div`
  width: 2px;
  height: 25px;
  background: white;
  position: absolute;
  left: 11.5px;
`;

export const Vx = styled.div`
  width: 25px;
  height: 2px;
  background: white;
  position: absolute;
  top: 11.5px;
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
  max-width: 375px;
  padding: 20px;
  border-radius: 10px;
  margin-top: 10px;
`;

// export const TopFiveParentDiv = styled.div`
//   display: flex;
//   flex-direction: column;
//   background-size: cover;
//   background: rgb(0, 0, 0);
//   background: linear-gradient(
//     0deg,
//     rgba(76, 76, 255, 1) 0%,
//     rgba(101, 214, 238, 1) 100%
//   );
//   max-width: 375px;
//   padding: 20px;
//   border-radius: 10px;
//   margin-top: 10px;
// `;

export const TopFiveHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

export const Headline = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
`;

export const DateRange = styled.h3`
  color: white;
  margin: 0;
  font-size: 14px;
  font-weight: 400;
`;

export const LogoDiv = styled.img`
  width: 110px;
  margin: auto;
  padding-top: 20px;
`;

export const TitleHr = styled.hr`
  border-top: 0.5px solid white;
  opacity: 0.3;
  margin: 5px 0;
`;

export const HorizontalRule = styled.hr`
  border-top: 0.5px solid white;
  opacity: 0.3;
  margin: 5px 0 5px 0;
`;
