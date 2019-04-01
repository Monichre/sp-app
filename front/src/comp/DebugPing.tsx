import React from 'react';
import { usePing } from '../types';
import { DebugPrint } from '../comp/DebugPrint';

export const DebugPing: React.SFC = () => {
  const {data, error, loading } = usePing()
  return (
    <DebugPrint value={{data, error, loading}} title='GraphQL Ping Result'/>
  )
}

