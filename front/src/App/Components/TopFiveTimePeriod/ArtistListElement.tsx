import * as React from "react";
import {
  ListElement,
  ArtistInfo,
  ArtistImage,
  OrderNumber,
  InfoText
} from "./ArtistListElement.styles";
import { HorizontalRule } from "./TopFiveTimePeriod.styles";

export interface ArtistListElementProps {
  artist: {
    artistName: string;
    timePlayed: number;
    artistImage: string;
    artistPlace: number;
  };
}

export const ArtistListElement: React.SFC<ArtistListElementProps> = ({
  artist
}) => {
  return (
    <div>
      <ListElement>
        <OrderNumber>{artist.artistPlace}</OrderNumber>
        <ArtistInfo>
          <InfoText className="artist-title">{artist.artistName}</InfoText>
          <InfoText className="time-played">{artist.timePlayed}</InfoText>
        </ArtistInfo>
        <ArtistImage src={artist.artistImage} alt="" />
      </ListElement>
      {artist.artistPlace == 5 ? null : <HorizontalRule />}
    </div>
  );
};
