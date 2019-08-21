import * as React from 'react';
import styled, { css } from 'styled-components';
import { TopListener } from '../../../../../../back/src/fns/graphql/types';
import { ArtistFragmentTopListeners } from '../../../../types';
import { hrsAndMins } from '../../../../lib/durationFormats';

const TopListenerRow: any = styled.ul`
	margin-top: 100px;
	padding: 20px;
	list-style: none;
	display: flex;
	justify-content: space-evenly;
`

const TopListenerCard: any = styled.li`
    
	width: 145px;
    height: 175px;
	padding: 60px 20px 40px;
	position: relative;
	vertical-align: top;
	margin: 10px;
	border: 1px solid #252727;
	text-align: left;

	${(props: any) => props.lifetime && css`
		margin-top: 80px;
	`}

    .inner {
        z-index: 1;
        position: relative;
		background: transparent;
		padding-top: 30px;
    h2 {
	font-size: 114px;
	margin: 0;
	position: absolute;
	opacity: 0.2;
	top: -80px;
	right: 5px;
	transition: all 0.3s ease-in-out;
}
 h3 {
	font-size: 20px;
	color: #fff;
	margin-bottom: 5px;
}
 p {
	font-size: 16px;
	line-height: 18px;
	color: #fff;
	margin-top: 5px;
}
 button {
	background: transparent;
	/* border: 1px solid #fff!important; */
	padding: 2px;
	color: #fff;
	border-radius: 50%;
	position: relative;
	transition: all 0.3s ease-in-out;
	transform: translate(-50px, -40px);
	opacity: 0;
	cursor: pointer;
	overflow: hidden;

	img {
		height: 60px;
		width: 60px;
		border-radius: 50%;
	}
}
 button:before {
	content: '';
	position: absolute;
	height: 100%;
	width: 120%;
	background: #000!important;
	top: 0;
	opacity: 0;
	left: -140px;
	border-radius: 50%;
	z-index: 0;
	transition: all 0.3s ease-in-out;
	
}
    }


&:hover button {
	/* transform: translateY(5px); */
	transform: translate(100px, -40px);
	opacity: 1;
}
 button:hover {
	color: #262a2b;
}
 /* button:hover:before {
	left: 0;
	opacity: 1;
} */

&:hover h2 {
	top: -120px;
	opacity: 0.6;
    transform: scale(.8);
}


&:before {
	content: '';
	position: absolute;
    width: 150px;
	height: 180px;
	/* width: 145px; */
    /* height: 175px; */
	top: -2px;
	left: -2px;
	right: -2px;
	bottom: -2px;
	z-index: 0;
	background: #fff;
	transform: skew(2deg, 2deg);
}
&:after {
	content: '';
	position: absolute;
	width: 97%;
    height: 98%;
    z-index: 0;
    left: 4px;
    top: 3px;
    background: #000;
}



&:nth-child(1):before {
	background: #C9FFBF;
background: -webkit-linear-gradient(to right, #FFAFBD, #C9FFBF);
background: linear-gradient(to right, #FFAFBD, #C9FFBF);
}
&:nth-child(2):before {
	background: #f2709c;
background: -webkit-linear-gradient(to right, #ff9472, #f2709c);
background: linear-gradient(to right, #ff9472, #f2709c);
}
&:nth-child(3):before {
	background: #c21500;
background: -webkit-linear-gradient(to right, #ffc500, #c21500);
background: linear-gradient(to right, #ffc500, #c21500);
}
&:nth-child(4):before {
	background: #FC354C;
background: -webkit-linear-gradient(to right, #0ABFBC, #FC354C);
background: linear-gradient(to right, #0ABFBC, #FC354C);
}
`


const BadgeWrap = styled.div`
height: 60px;
width: 60px;

img {
	object-fit: contain;
	object-position: center;
	height: 100%;
	width: 100%;
}
`

const TimeScopeTitle: any = styled.h3`
	position: absolute;
	top: -62px;
	right:  -50%;
	color: white;
	width: max-content;
	font-weight: bold;
	font-size: 20px;
	z-index: 10;

	&::before {
		    content: '';
    position: absolute;
    top: 2px;
    height: 50%;
    border-bottom: 3px solid #64d6ee;
    width: 27px;
    /* z-index: 53; */
    left: -31px;
	}

	${(props: any) => props.lifetime && css`
		top: -42px;
	`}

`

interface ArtistTopListenersProps {
	topListeners: ArtistFragmentTopListeners[] | any
}

interface LifeTimeTopProps {
	life: ArtistFragmentTopListeners
}

const Badge: React.SFC = ({ children }) => <BadgeWrap>{children}</BadgeWrap>

const achievementIconMap: any = {
	1: '/icons/first-currentUser.png',
	2: '/icons/second-currentUser.png',
	3: '/icons/third.svg',
}

export const scopeTheListeners = (topListeners: any[]) => {

	const timePerspectiveAchievementMap: any = {
		'day': {
			title: "Today's Top Listener",
			listener: null
		},
		'week': {
			title: "Weekly Top Listener",
			listener: null
		},
		'month': {
			title: "Monthly Top Listener",
			listener: null
		},
		'life': {
			title: "Lifetime Top Listener",
			listener: null
		}
	}

	for (let time in timePerspectiveAchievementMap) {
		const tScopeTopListener = topListeners.find((listener: any) => listener.pk.split('#').includes(time))

		timePerspectiveAchievementMap[time].listener = tScopeTopListener ? { ...tScopeTopListener } : null

		if (!timePerspectiveAchievementMap[time].listener) {
			delete timePerspectiveAchievementMap[time]
		}

	}

	return timePerspectiveAchievementMap
}



export const LifeTimeTopListener: React.SFC<LifeTimeTopProps> = ({ life }) => {

	const { listener: { total, user } }: any = life

	// const { hrs, mins } = hrsAndMins(total)

	return (
		<TopListenerCard lifetime={true}>
			<TimeScopeTitle lifetime={true}>
				All Time Top Listener
			</TimeScopeTitle>
			<div className='inner'>
				<h2>
					<Badge>
						<img src={achievementIconMap[1]} />
					</Badge>
				</h2>
				<h3>{user.displayName ? user.displayName : user.email}</h3>

				{user.photoURL ? <button><img src={user.photoURL} /></button> : null}
			</div>
		</TopListenerCard>
	)


}
export const ArtistTopListeners: React.SFC<ArtistTopListenersProps> = ({ topListeners }) => {
	return (

		<TopListenerRow>
			{topListeners.map((listenerData: any, index: number) => {
				const { listener, title }: any = listenerData
				const { total, user } = listener

				const { hrs, mins } = hrsAndMins(total)

				return index !== 3 ? (
					<TopListenerCard key={index}>
						<TimeScopeTitle>
							{title}
						</TimeScopeTitle >
						<div className='inner'>
							<h2>
								<Badge>
									<img src={achievementIconMap[1]} />
								</Badge>
							</h2>
							<h3>{user.displayName ? user.displayName : user.email}</h3>

							{user.photoURL ? <button><img src={user.photoURL} /></button> : null}
						</div>
					</TopListenerCard>
				) : null
			})
			}

		</TopListenerRow>



	);
}

