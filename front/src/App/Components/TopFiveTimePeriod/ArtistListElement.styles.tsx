import * as React from "react";
import styled, { css } from "styled-components";

export const ListElement = styled.div`
  display: flex;
  flex-direction: row;
  height: 50px;
  align-items: center;
`;

export const OrderNumber = styled.h2`
  opacity: 0.5;
  padding-right: 10px;
`;

export const ArtistInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ArtistImage = styled.img`
  border-radius: 5px;
  margin-left: auto;
`;

export const InfoText = styled.p`
  padding: 0;
  margin: 0;
`;
