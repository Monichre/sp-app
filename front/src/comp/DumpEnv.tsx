import React from 'react'
import { DebugPrint } from './DebugPrint';

export const DumpEnv: React.SFC = () =>
  <DebugPrint title='Build Env' value={process.env}/>
