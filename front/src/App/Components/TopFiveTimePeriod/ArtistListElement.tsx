import * as React from "react";
import {
  ListElement,
  ArtistInfo,
  ArtistImage,
  OrderNumber,
  InfoText
} from "./ArtistListElement.styles";
import { HorizontalRule } from "./TopFiveTimePeriod.styles";
import { Artist } from "../../../../../back/src/fns/graphql/types";
import { hrsAndMins } from "../../../lib/durationFormats";

const formatListeningTime = (total: number) => {
  const { hrs, mins } = hrsAndMins(total);
  const hours = hrs ? `${hrs} hours & ` : "";
  const minutes = mins ? `${mins} mins` : "";

  return `${hours}${minutes}`;
};

export type ArtistListElementProps = {
  artist: Artist;
  place: number;
  totalTimeListened: number;
};

export const ArtistListElement: React.SFC<ArtistListElementProps> = ({
  artist,
  place,
  totalTimeListened
}) => {
  const ttl = formatListeningTime(totalTimeListened);
  console.log("xxxTTL", ttl);

  return (
    <div>
      <ListElement>
        <OrderNumber>{place}</OrderNumber>
        <ArtistInfo>
          <InfoText className="artist-title">{artist.name}</InfoText>
          <InfoText className="time-played">{totalTimeListened}</InfoText>
        </ArtistInfo>
        <ArtistImage src={artist.images[0].url} alt="" />
      </ListElement>
      {place == 5 ? null : <HorizontalRule />}
    </div>
  );
};
