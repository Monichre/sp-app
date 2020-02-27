import * as React from "react";
import { ArtistListElement } from "./ArtistListElement";
import {
  OpaqueBackground,
  TopFiveParentDiv,
  TopFiveHeader,
  Headline,
  LogoDiv,
  CloseButton,
  ModalWrapper,
  Hx,
  Vx,
  ShareTip,
  TipAndCloseWrapper
} from "./TopFiveTimePeriod.styles";
import moment from "moment";

const today = moment();
const from_date = today.startOf("week");
const to_date = today.endOf("week");
console.log("ttl", {
  from_date: from_date.toString(),
  today: moment().toString(),
  to_date: to_date.toString()
});

const perspectiveMap = (perspective: string) => {
  if (perspective == "Your") {
    return "My";
  } else return "Soundpruf's";
};

export interface TopFiveTimePeriodProps {
  period: string;
  toggle: any;
  artists: any;
  perspective: string;
}

export const TopFiveTimePeriod: React.SFC<TopFiveTimePeriodProps> = ({
  period,
  toggle,
  artists,
  perspective
}) => {
  const translatedPerspective = perspectiveMap(perspective);

  return (
    <OpaqueBackground className="top-five-time-period">
      <ModalWrapper>
        <TipAndCloseWrapper>
          <ShareTip>Screenshot this image and share!</ShareTip>
          <CloseButton className="test" onClick={toggle}>
            <Hx />
            <Vx />
          </CloseButton>
        </TipAndCloseWrapper>
        <TopFiveParentDiv>
          <TopFiveHeader>
            <Headline>
              {translatedPerspective} {period} In Music
            </Headline>
            {/* <DateRange>{periodTitle}</DateRange> */}
          </TopFiveHeader>
          {artists.map(({ artist, personal }: any, index: number) => {
            return (
              <ArtistListElement
                place={index + 1}
                artist={artist}
                totalTimeListened={personal}
                perspective={translatedPerspective}
              />
            );
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
