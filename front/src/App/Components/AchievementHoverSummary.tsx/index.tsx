import * as React from 'react';
import styled from 'styled-components';
import {
    HoverBoxWrapper,
    BubbleAprox,
    BubbleIcon,
    BubbleContent,
    Bubble
} from './styles'

export interface AchievementHoverSummaryProps {
    children: any
    userId: string
    content: string

}

export const AchievementHoverSummary: React.SFC<AchievementHoverSummaryProps> = ({ children, userId, content }) => {
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
        </HoverBoxWrapper>



    );
}

