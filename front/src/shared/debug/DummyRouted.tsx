import React from 'react';
import { RouteComponentProps } from 'react-router';

export const DummyRouted: React.SFC<RouteComponentProps> = ({match: { path }}) =>
  <div>
    <h1>Dummy Page {path}</h1>
  </div>
