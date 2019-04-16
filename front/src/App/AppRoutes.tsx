import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { Home } from "./Home/Home"
import { CustomAuth } from "./CustomAuth"

export const AppRoutes: React.SFC = () =>
  <Router>
    <Switch>
      <Route path="/customAuth" component={CustomAuth} />
      <Route path="/" component={Home} />
    </Switch>
  </Router>