import * as React from "react";
import { ArtistListElement } from "./ArtistListElement";
import {
  OpaqueBackground,
  TopFiveParentDiv,
  TopFiveHeader,
  LogoDiv,
  HorizontalRule
} from "./TopFiveTimePeriod.styles";

export interface TopFiveTimePeriodProps {
  artistArray: any;
}

export const TopFiveTimePeriod: React.SFC<TopFiveTimePeriodProps> = ({
  artistArray
}) => {
  return (
    <OpaqueBackground>
      <TopFiveParentDiv>
        <TopFiveHeader>
          <h1>My Week In Music</h1>
          <HorizontalRule />
          <h3>Feb 2 - Feb 9</h3>
        </TopFiveHeader>
        {artistArray.map((artist: any) => {
          return <ArtistListElement artist={artist} />;
        })}
        <LogoDiv
          src="http://live.soundpruf.com/static/media/sp-white-logo-horizontal.99cc2d83.png"
          alt=""
        />
      </TopFiveParentDiv>
    </OpaqueBackground>
  );
};
