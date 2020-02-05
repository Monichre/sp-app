import * as React from 'react';

export interface ArtistListElementProps {
  artist: {
    artistName: string,
    timePlayed: number,
    artistImage: string
  }
}

export const ArtistListElement: React.SFC<ArtistListElementProps> = ({ artist }) => {
  return (<div className="ArtistListElement">
    <div>{artist.artistName}</div>
    <div>{artist.timePlayed}</div>
    <img src={artist.artistImage} alt="" />
  </div>
  );
}