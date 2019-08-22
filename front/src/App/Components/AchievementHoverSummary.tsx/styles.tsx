
import * as React from 'react';
import styled, {css} from 'styled-components'


export const HoverBoxWrapper = styled.div`
	margin: 7.5em auto;
	
	border-radius: 12px;
	padding: 2em;
	overflow: hidden;
	position: relative;
    background-color: rgba(216,216,216,.015);
	
	
	
	*:first-child { margin-top: 0; }
	*:last-child { margin-bottom: 0; }
`
export const BubbleAprox = styled.div`
	width: 3em;
	height: 3em;
	top: 0;
	left: 0;
	position: absolute;
	border-radius: 0 0% 100% 0;
	
	&:hover + .bubble,
	&:hover + .bubble:before {
		padding: .2em;
		border-radius: 0 0 90% 0;
	}
`


export const BubbleIcon = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	z-index: 3;
	transition: .8s ease;
	padding: .6em .9em;
	line-height: 1;
	font-size: 1em;
`

export const BubbleContent = styled.div`
	position: absolute;
	top: -200%;
	transform: translateY(-50%);
	transition: .8s/2 ease;
	text-align: center;
	width: 100%;
	color: #fff;
	left: -200%;
	padding: 1.2em;
`

export const Bubble = styled.div`
	position: absolute;
	color: #fff;
	height: 2.5em;
	width: 2.5em;
	transform-style: preserve-3d;
	border-radius: 0 0% 100% 0;
	top: 0;
	left: 0;
	z-index: 2;
	transition: .8s/2 ease;
	
	&:before {
		content: '';
		height: 2.5em;
		width: 2.5em;
		transition: .8s ease;
		border-radius: 0 0% 100% 0;
		background-image: linear-gradient(to bottom, #e64a19 0%, #ffa726 100%);
            /* background-color: rgba(216,216,216,.05); */
		top: 0;
		left: 0;
		position: absolute;
		z-index: 1;
	}
	
	&:hover {
		width: 100%;
		height: 100%;
		
		&:before {
			border-radius: 0;
			width: 150%;
			height: 150%;
			transition: .8s ease;
          
		}
		
		${BubbleIcon} {
			top: -50%;
			left: -50%;
			transition: .8s ease;
		}
		
		${BubbleContent} {
			transition: .8s ease;
			top: 50%;
			left: 0;
			z-index: 4;
		}
	}
`


export const AchievementAxisTitle: any = styled.div`
	position: absolute;
	height: 100%;
	width: 53px;
	top: 0;
	right: 53px;
	display: none;
	justify-content: center;

	h4 {
		writing-mode: vertical-rl;
		color: #fff;
		text-align: center;
		letter-spacing: 2px;
	}

	${(props: any) => props.achievementsGraph && css`
		display: flex;

	`}
`