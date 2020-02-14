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
  ModalWrapper,
  Hx,
  Vx
} from "./TopFiveTimePeriod.styles";
import { Artist } from "../../../../../back/src/shared/SharedTypes";
import { PerspectiveDashArtists } from "../../../types";
import moment from "moment";

const today = moment();
const from_date = today.startOf("week");
const to_date = today.endOf("week");
console.log("ttl", {
  from_date: from_date.toString(),
  today: moment().toString(),
  to_date: to_date.toString()
});

export interface TopFiveTimePeriodProps {
  artists: PerspectiveDashArtists[];
  period: string;
  timeScope: string;
  toggle: any;
}

export const TopFiveTimePeriod: React.SFC<TopFiveTimePeriodProps> = ({
  artists,
  period,
  timeScope,
  toggle
}) => {
  return (
    <OpaqueBackground className="top-five-time-period">
      <ModalWrapper>
        <CloseButton className="test" onClick={toggle}>
          <Hx />
          <Vx />
        </CloseButton>
        <TopFiveParentDiv>
          <TopFiveHeader>
            <Headline>My {timeScope.replace("this", "")} In Music</Headline>
            <TitleHr />
            <DateRange>{period}</DateRange>
          </TopFiveHeader>
          {artists.map(
            ({ artist, personal: totalTimeListened }: any, index: number) => {
              return (
                <ArtistListElement
                  place={index + 1}
                  artist={artist}
                  totalTimeListened={totalTimeListened}
                />
              );
            }
          )}
          <LogoDiv
            src="http://live.soundpruf.com/static/media/sp-white-logo-horizontal.99cc2d83.png"
            alt=""
          />
        </TopFiveParentDiv>
      </ModalWrapper>
    </OpaqueBackground>
  );
};
