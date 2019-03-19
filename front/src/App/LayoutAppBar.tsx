import React from 'react'
import { AppBar } from './AppBar';

export const LayoutAppBar: React.SFC = ({children}) =>
  <div>
    <AppBar/>
    {children}
  </div>
