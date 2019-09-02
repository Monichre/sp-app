import * as React from 'react'
import { Component } from 'react'
import styled from 'styled-components'
import { Progress } from 'antd'

export interface AchievementComparisonProps {

}

export const AchievementComparison: React.SFC<AchievementComparisonProps> = () => {
    return (<div style={{ width: 170 }}>
        <Progress percent={30} size="small" />
        <Progress percent={50} size="small" status="active" />
        <Progress percent={70} size="small" status="exception" />
        <Progress percent={100} size="small" />
    </div>);
}

