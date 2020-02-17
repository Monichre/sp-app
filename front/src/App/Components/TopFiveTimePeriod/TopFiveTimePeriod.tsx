import * as React from "react";
import { ArtistListElement } from "./ArtistListElement";
import {
  OpaqueBackground,
  TopFiveParentDiv,
  TopFiveHeader,
  Headline,
  LogoDiv,
  TitleHr,
  CloseButton,
  ModalWrapper,
  Hx,
  Vx,
  ShareTip
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

export interface TopFiveTimePeriodProps {
  period: string;
  toggle: any;
  achievements: any;
}

export const TopFiveTimePeriod: React.SFC<TopFiveTimePeriodProps> = ({
  period,
  toggle,
  achievements
}) => {
  const periodLowerCase = period.toLowerCase();
  const artistArray = achievements[periodLowerCase].slice(0, 5);

  return (
    <OpaqueBackground className="top-five-time-period">
      <ModalWrapper>
        <CloseButton className="test" onClick={toggle}>
          <Hx />
          <Vx />
        </CloseButton>
        <ShareTip>Screenshot this image and share!</ShareTip>
        <TopFiveParentDiv>
          <TopFiveHeader>
            <Headline>My {period} In Music</Headline>
            <TitleHr />
            {/* <DateRange>{periodTitle}</DateRange> */}
          </TopFiveHeader>
          {artistArray.map(
            ({ artistData, achievement }: any, index: number) => {
              const { artist } = artistData;
              const { total, pk } = achievement;
              console.log("xxxTOTAL", total);
              console.log("xxxPK", pk);
              return (
                <ArtistListElement
                  place={index + 1}
                  artist={artist}
                  totalTimeListened={total}
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
