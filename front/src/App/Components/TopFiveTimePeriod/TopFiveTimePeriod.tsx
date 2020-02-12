import * as React from "react";
import { ArtistListElement } from "./ArtistListElement";
import {
  OpaqueBackground,
  TopFiveParentDiv,
  TopFiveHeader,
  Headline,
  DateRange,
  LogoDiv,
  HorizontalRule,
  TitleHr,
  CloseButton,
  ModalWrapper
} from "./TopFiveTimePeriod.styles";

export interface TopFiveTimePeriodProps {
  artistArray: any;
}

export const TopFiveTimePeriod: React.SFC<TopFiveTimePeriodProps> = ({
  artistArray
}) => {
  return (
    <OpaqueBackground>
      <ModalWrapper>
        <CloseButton />
        <TopFiveParentDiv>
          <TopFiveHeader>
            <Headline>My Week In Music</Headline>
            <TitleHr />
            <DateRange>Feb 2 - Feb 9</DateRange>
          </TopFiveHeader>
          {artistArray.map((artist: any) => {
            return <ArtistListElement artist={artist} />;
          })}
          <LogoDiv
            src="http://live.soundpruf.com/static/media/sp-white-logo-horizontal.99cc2d83.png"
            alt=""
          />
        </TopFiveParentDiv>
      </ModalWrapper>
    </OpaqueBackground>
  );
};
