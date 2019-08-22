import * as React from 'react';
import styled from 'styled-components';
import {
    HoverBoxWrapper,
    BubbleAprox,
    BubbleIcon,
    BubbleContent,
    Bubble,
    AchievementAxisTitle
} from './styles'

export interface AchievementHoverSummaryProps {
    children: any
    userId: string
    content: string
    achievementsGraph?: boolean
    period?: string

}

export const AchievementHoverSummary: React.SFC<AchievementHoverSummaryProps> = ({ children, userId, achievementsGraph=false, content , period}) => {
    return (


        <HoverBoxWrapper>
            <BubbleAprox></BubbleAprox>
            <Bubble>
                <BubbleIcon>i</BubbleIcon>
                <BubbleContent>
                    {content}
			</BubbleContent>
            </Bubble>

            {children}
            {/* <AchievementAxisTitle achievementsGraph={achievementsGraph}>
                <h4>Platform Leaders {period ? period : null}</h4>
            </AchievementAxisTitle> */}
        </HoverBoxWrapper>



    );
}

