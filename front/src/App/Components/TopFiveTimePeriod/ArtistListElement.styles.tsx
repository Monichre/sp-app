import * as React from "react";
import styled, { css } from "styled-components";

export const ListElement = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const OrderNumber = styled.h2`
  opacity: 0.5;
  padding-right: 10px;
  margin: 0;
  font-size: 35px;
  font-weight: 600;
`;

export const ArtistInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ArtistImage = styled.img`
  border-radius: 5px;
  margin-left: auto;
  width: 35px;
  height: 35px;
  object-fit: cover;
  object-position: 50% 50%;
`;

export const ArtistName = styled.p`
  padding: 0;
  margin: 0;
  font-size: 16px;
  line-height: 16px;
`;

export const TimePlayed = styled.p`
  padding: 0;
  margin: 0;
  font-size: 13px;
  font-weight: 300;
  opacity: 0.6;
`;
