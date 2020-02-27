import * as React from "react";
import {
  ListElement,
  GenreName,
  GenreInfo,
  OrderNumber,
  TimePlayed,
  GenreImage
} from "./GenreListElement.styles";
import { HorizontalRule } from "./TopFiveTimePeriod.styles";
import { hrsAndMins } from "../../../lib/durationFormats";

const formatListeningTime = (total: number) => {
  const totalInMilliseconds = total * 3600000;
  const { hrs, mins } = hrsAndMins(totalInMilliseconds);
  const hours = hrs ? `${hrs}h ` : "";
  const minutes = mins ? `${mins}m` : "";

  return `${hours}${minutes}`;
};

export type GenreListElementProps = {
  genre: any;
  place: number;
  totalTimeListened: number;
};

export const GenreListElement: React.SFC<GenreListElementProps> = ({
  place,
  totalTimeListened,
  genre
}) => {
  const ttl = formatListeningTime(totalTimeListened);
  return (
    <div>
      {/* Better method for this? */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
      body { 
        overflow: hidden;
      }
    `
        }}
      />
      <ListElement>
        <OrderNumber>{place}</OrderNumber>
        <GenreInfo>
          <GenreName>{genre}</GenreName>
          <TimePlayed>{ttl}</TimePlayed>
        </GenreInfo>
        <GenreImage src="https://via.placeholder.com/100x100" alt="" />
      </ListElement>
      {place == 5 ? null : <HorizontalRule />}
    </div>
  );
};
