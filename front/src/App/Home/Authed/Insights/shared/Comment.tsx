import React from 'react';
import { TPathParams, insightLink } from './functions';
import { Link } from 'react-router-dom';
import { PerspectiveDashArtists } from '../../../../../types';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, CartesianGrid, Label, Text, LineChart, Line } from 'recharts';
import { BRAND_GLOBAL_COLOR, BRAND_PERSONAL_COLOR, notLargeQuery } from '../../../../../shared/media';
import styled from 'styled-components';

export const Comment = styled.div`
  opacity: 0.5;
  a {
    color: ${BRAND_PERSONAL_COLOR};
  }
`
