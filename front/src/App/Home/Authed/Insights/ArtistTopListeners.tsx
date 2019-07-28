import * as React from 'react';
import styled from 'styled-components';
import { TopListener } from '../../../../../../back/src/fns/graphql/types';
import { ArtistFragmentTopListeners } from '../../../../types';

const TopListenerRow: any = styled.ul`
	padding: 0;
	list-style: none;
    display: flex;
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

    .inner {
        z-index: 1;
        position: relative;
        background: transparent;
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



interface ArtistTopListenersProps {
    topListeners: ArtistFragmentTopListeners[] | any
}

export const ArtistTopListeners: React.SFC<ArtistTopListenersProps> = ({ topListeners }) => {
    return (
        <TopListenerRow>
            {topListeners.length ? topListeners.map((topListener: TopListener, index: number) => {
				const { total, user }: any = topListener
				const achievementIconMap: any = {
					1: (): any => <img src='/icons/first-currentUser.png' />,
					2: (): any => <img src='/icons/second-currentUser.png' />,
					3: (): any => <img src='/icons/third.svg' />,
				}
				const BadgeImg: React.SFC = achievementIconMap[index + 1]
				const Badge: React.SFC = () => <BadgeWrap><BadgeImg /></BadgeWrap>

                return (
                    <TopListenerCard>
                        <div className='inner'>
                        <h2><Badge /></h2>
                        <h3>{user.displayName ? user.displayName : user.email}</h3>
                        <p>
                                Total: {Math.round((total / 3600000) * 100)} mins
                        </p>
                            {user.photoURL ? <button><img src={user.photoURL} /></button> : null}
                        </div>
                    </TopListenerCard>
                )
            }) : null}
        </TopListenerRow>

    );
}

