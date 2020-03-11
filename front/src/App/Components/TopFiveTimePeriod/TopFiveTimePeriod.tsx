import * as React from "react";
import { ArtistListElement } from "./ArtistListElement";
import { GenreListElement } from "./GenreListElement";
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
import { StringNullableChain } from "lodash";

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

const artistOrGenre = (data: any) => {
  if (data[0].genre) {
    return "Genres";
  }
  if (data[0].artist) {
    return "Artists";
  }
};

export interface TopFiveTimePeriodProps {
  period: string;
  toggle: any;
  data: any;
  perspective: string;
}

export const TopFiveTimePeriod: React.SFC<TopFiveTimePeriodProps> = ({
  period,
  toggle,
  data,
  perspective
}) => {
  const translatedPerspective = perspectiveMap(perspective);
  console.log("xxxARTIST-OR-GENRE", artistOrGenre(data));
  const content = artistOrGenre(data);

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
        <TopFiveParentDiv className="top-five-parent-div">
          <TopFiveHeader>
            <Headline>
              {translatedPerspective} {period} In Music
            </Headline>
            {/* <DateRange>{periodTitle}</DateRange> */}
          </TopFiveHeader>
          {data.map(({ genre, artist, personal }: any, index: number) => {
            return artist ? (
              <ArtistListElement
                place={index + 1}
                artist={artist}
                totalTimeListened={personal}
                perspective={perspective}
              />
            ) : (
              <GenreListElement
                place={index + 1}
                genre={genre}
                totalTimeListened={personal}
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
