import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./Home/Home";
import { CustomAuth } from "./CustomAuth";
import { TopFiveTimePeriod } from "./Components/TopFiveTimePeriod/TopFiveTimePeriod";

const artists = [
  {
    artistName: "Weezer",
    timePlayed: "12h 5m",
    artistImage: "https://via.placeholder.com/100",
    artistPlace: 1
  },
  {
    artistName: "System of a Down",
    timePlayed: "10h 20m",
    artistImage: "https://via.placeholder.com/100",
    artistPlace: 2
  },
  {
    artistName: "The Shins",
    timePlayed: "9h 33m",
    artistImage: "https://via.placeholder.com/100",
    artistPlace: 3
  },
  {
    artistName: "Lil Yachty",
    timePlayed: "4h 13m",
    artistImage: "https://via.placeholder.com/100",
    artistPlace: 4
  },
  {
    artistName: "Gucci Mane",
    timePlayed: "2h 49m",
    artistImage: "https://via.placeholder.com/100",
    artistPlace: 5
  }
];

export const AppRoutes: React.SFC = () => (
  <Router>
    <Switch>
      <Route path="/customAuth" component={CustomAuth} />
      <Route path="/" component={Home} />

      <Route
        exact
        path="/insights/thisWeek/global/personal/topfive"
        render={() => {
          return <TopFiveTimePeriod artistArray={artists} />;
        }}
      />
    </Switch>
  </Router>
);
