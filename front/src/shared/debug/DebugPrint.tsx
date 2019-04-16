import React from 'react'

export const DebugPrint: React.SFC<{value: any, title?: string}> = ({value, title}) =>
  <div style={{padding: '0.5rem', backgroundColor: '#CCC'}}>
    <h3 style={{margin:0}}>{title || 'Debug Print'}</h3>
    <pre>{JSON.stringify(value, null, 2)}</pre>
  </div>
