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
    
	width: 195px;
    height: 225px;
	padding: 80px 20px 40px;
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
	color: #b7b7b7;
	margin-bottom: 5px;
}
 p {
	font-size: 16px;
	line-height: 18px;
	color: #b7b7b7;
	margin-top: 5px;
}
 button {
	background: transparent;
	/* border: 1px solid #b7b7b7!important; */
	padding: 10px 20px;
	color: #b7b7b7;
	border-radius: 3px;
	position: relative;
	transition: all 0.3s ease-in-out;
	transform: translateY(-40px);
	opacity: 0;
	cursor: pointer;
	overflow: hidden;
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
	border-radius: 0 20px 20px 0;
	z-index: 0;
	transition: all 0.3s ease-in-out;
	
}
    }


&:hover button {
	transform: translateY(5px);
	opacity: 1;
}
 button:hover {
	color: #262a2b;
}
 button:hover:before {
	left: 0;
	opacity: 1;
}

&:hover h2 {
	top: -120px;
	opacity: 0.6;
    transform: scale(.8);
}


&:before {
	content: '';
	position: absolute;
    width: 200px;
    height: 230px;
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
	width: 100%;
	height: 100%;
    z-index: 0;
    left: 0;
    top: 0;
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




interface ArtistTopListenersProps {
    topListeners: ArtistFragmentTopListeners[] | any
}


export const ArtistTopListeners: React.SFC<ArtistTopListenersProps> = ({ topListeners }) => {
    return (
        <TopListenerRow>
            {topListeners.length ? topListeners.map((topListener: TopListener, index: number) => {
                const { total, user }: any = topListener
                return (
                    <TopListenerCard>
                        <div className='inner'>
                        <h2>{index + 1}</h2>
                        <h3>{user.displayName ? user.displayName : user.email}</h3>
                        <p>
                                Total Time Listened: {Math.round((total / 3600000) * 100)} mins
                        </p>
                            {user.photoURL ? <button><img src={user.photoURL} /></button> : null}
                        </div>
                    </TopListenerCard>
                )
            }) : null}
        </TopListenerRow>

    );
}

