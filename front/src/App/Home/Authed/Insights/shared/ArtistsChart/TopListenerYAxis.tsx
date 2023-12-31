import React, { useState, useContext, useEffect, useMemo } from "react";
import { Link } from 'react-router-dom';
import { UserAchievementContext } from '../../../../Authed/Authed'
import { comparePersonalAndGroupScore } from '../../../../../Components/UserAchievementsList/achievements-utils'
import { normalizeTimeScope } from '../../../../Authed/Insights/Main/Overview'
import { PopOverStyle } from '../../../../../Components/PopOver';
import { TickProps } from './ArtistsChart';
import { AchievementHoldersList } from '../../../../../Components/ArtistAchievementHolders/AchievementHoldersList';


const firstPlaceBadge: any = '/icons/first-currentUser.png'
const secondPlaceBadge = '/icons/second-currentUser.png'
const thirdPlaceBadge = '/icons/third.svg'

export const badgeMap: any = {
    0: firstPlaceBadge,
    1: secondPlaceBadge,
    2: thirdPlaceBadge,
    first: firstPlaceBadge,
    second: secondPlaceBadge,
    third: thirdPlaceBadge
}


const TopListenerLink: any = ({ className, handleClick, children }: any) => (

    <Link to='#' className={className} style={{
        position: 'relative'
    }} onClick={handleClick}>
        {children}
        <clipPath id='clipCircle2'>
            <circle r='16px' cx='16px' cy='16px' />
        </clipPath>

    </Link>

)



const AchievementHoldersPopUp: React.SFC<any> = ({ x, y, artist, pathParams, totalTimeListened,
    groupScore, visible, handleClick }) => {
    
        console.log('TCL: artist', artist)

    console.count('AchievementHoldersPopUp render')

    // Context Props
    const context = useContext(UserAchievementContext)
    const { topArtistsWithAchievementHolders } = context
    const [currentPeriodAchievementHolders, setCurrentPeriodAchievementHolders]: any = useState(null)
    const [useDayData, setUseDayData] = useState(false)
    const [useLifeData, setUseLifeData] = useState(false)
    const [localArtist, setLocalArtist] = useState(artist)
    // const [achievementHolders, setAchievementHolders] = useState(null)

    const { timeScope }: any = pathParams

    useEffect(() => {
        // Enriched Current Artist from filtering context props artist data toward passed props current artist
        if (artist && topArtistsWithAchievementHolders) {
            const _artist = topArtistsWithAchievementHolders.find((awa: any) => {
                console.log('TCL: _artist -> awa', awa)
                console.log(awa.artist.id === artist.id)
                return awa.artist.id === artist.id
            })
            console.log('TCL: _artist -> _artist', _artist)
            setLocalArtist(_artist)
        }

    }, [artist, topArtistsWithAchievementHolders])


    /*
    *
    * Here we fire the context method #setCurrentPeriodAchievementHolders to update our previously established top artists with their latest achievement holder data
    *  
    * 
    */


    useEffect(() => {
        if (localArtist) {
            console.log('TCL: localArtist first', localArtist)
            const { achievementHolders } = localArtist
            console.log('TCL: achievementHolders', achievementHolders)
            if (achievementHolders) {

                const { day = null, week = null, month = null, life = null } = achievementHolders
                const achievementHolderTimeScopeMap: any = {
                    today: day ? day : null,
                    thisWeek: week ? week : null,
                    thisMonth: month ? month : null,
                    lifetime: life ? life : null
                }

                const ahCurrentPeriod = Object.assign({}, achievementHolderTimeScopeMap[timeScope])
                const isBelowThreshold = (element: any, index: any, array: any) => {
                    return !ahCurrentPeriod[element].user || ahCurrentPeriod[element].user === null
                }
                const allAchievementValuesForPeriodNull = Object.keys(ahCurrentPeriod).every(isBelowThreshold)

                if (allAchievementValuesForPeriodNull && timeScope === 'thisWeek') {
                    setUseDayData(true)
                }

                if (allAchievementValuesForPeriodNull && timeScope === 'thisMonth') {
                    setUseLifeData(true)
                }


                let currentPeriod = useDayData ? Object.assign({}, achievementHolderTimeScopeMap.today) : useLifeData ? Object.assign({}, achievementHolderTimeScopeMap.lifetime) : Object.assign({}, ahCurrentPeriod)
                

                for (let place in currentPeriod) {
                    if (!currentPeriod[place].user) {
                        currentPeriod[place] = null
                    }
                }

                console.log('TCL: currentPeriod', currentPeriod)

                setCurrentPeriodAchievementHolders(currentPeriod)


            }

        }

    }, [topArtistsWithAchievementHolders, localArtist, pathParams])


    console.log('TCL: localArtist', localArtist)
    const { total, status } = comparePersonalAndGroupScore(totalTimeListened, groupScore)
    console.log('TCL: status', status)
    console.log('TCL: total', total)
    const currentUserIsTopListener: any = status

    const { first=false, second=false, third=false} = currentPeriodAchievementHolders ? currentPeriodAchievementHolders : {first: null, second: null, third: null}
   
    const title: any = normalizeTimeScope(pathParams)
    const topBadge = currentUserIsTopListener ? firstPlaceBadge : first && first.user.photoURL ? first.user.photoURL : second && second.user.photoURL ? second.user.photoURL : third && third.user.photoURL ? third.user.photoURL : '/icons/headphones.svg'


    const topSpot: any = <image href={topBadge} transform={`translate(${(x || 0) + 15}, ${(y || 0) - 20})`} width='30px' height='30px'
    />


    

    console.count('AchievementHolder PopUp Rendered:')


    
    return localArtist ? (

        <PopOverStyle placement="topLeft" content={ <AchievementHoldersList artist={localArtist} achievementHolders={localArtist.achievementHolders} style={{
            background: '#030616!important'
        }} />} title={localArtist.artist ? `${localArtist.artist.name}'s Top Listeners` : localArtist && localArtist.name ? `${localArtist.name}'s Top Listeners` : null} trigger="click"
            visible={visible} style={{
                background: '#030616!important'
            }}>
            <TopListenerLink handleClick={handleClick}>
                {topSpot}
            </TopListenerLink>
        </PopOverStyle>

    ) : null
}

export const TopListenerYaxis: React.SFC<TickProps & any> = ({ x, y, offset, artist = null, pathParams, userId, totalTimeListened, groupScore }) => {


    const [visible, setVisible] = useState(false)
    const handleClick = () => setVisible(visible => !visible)
    console.count('TopListenerYaxis render')


    return artist ? <AchievementHoldersPopUp {...{ x, y, offset, artist, pathParams, userId, totalTimeListened, groupScore, visible, handleClick }} /> : null

}










// import React, { useState, useContext, useEffect, useMemo } from "react";
// import { Link } from 'react-router-dom';
// import { UserAchievementContext } from '../../../../Authed/Authed'
// import { comparePersonalAndGroupScore } from '../../../../../Components/UserAchievementsList/achievements-utils'
// import { normalizeTimeScope } from '../../../../Authed/Insights/Main/Overview'
// import { PopOverStyle } from '../../../../../Components/PopOver';
// import { TickProps } from './ArtistsChart';
// import { AchievementHoldersList } from '../../../../../Components/ArtistAchievementHolders/AchievementHoldersList';


// const firstPlaceBadge: any = '/icons/first-currentUser.png'
// const secondPlaceBadge = '/icons/second-currentUser.png'
// const thirdPlaceBadge = '/icons/third.svg'

// export const badgeMap: any = {
//     0: firstPlaceBadge,
//     1: secondPlaceBadge,
//     2: thirdPlaceBadge,
//     first: firstPlaceBadge,
//     second: secondPlaceBadge,
//     third: thirdPlaceBadge
// }


// const TopListenerLink: any = ({ className, handleClick, children }: any) => (

//     <Link to='#' className={className} style={{
//         position: 'relative'
//     }} onClick={handleClick}>
//         {children}
//         <clipPath id='clipCircle2'>
//             <circle r='16px' cx='16px' cy='16px' />
//         </clipPath>

//     </Link>

// )



// const AchievementHoldersPopUp: React.SFC<any> = ({ x, y, artist: propsArtist, pathParams, totalTimeListened,
//     groupScore, visible, handleClick }) => {

//     console.count('AchievementHoldersPopUp render')
    
//     // Context Props
//     const context = useContext(UserAchievementContext)
//     const { topArtistsWithAchievementHolders, currentUser } = context
//     const [currentPeriodAchievementHolders, setCurrentPeriodAchievementHolders]: any = useState(null)

//     // Enriched Current Artist from filtering context props artist data toward passed props current artist
//     const { achievementHolders=null } = (propsArtist && topArtistsWithAchievementHolders && topArtistsWithAchievementHolders.length) ? topArtistsWithAchievementHolders.find((awa: any) => awa.artist.id === propsArtist.id) : {
//             achievementHolders: null
//         }

//     const { day = null, week = null, month = null, life = null } = achievementHolders ? achievementHolders : {
//         day: null, week: null, month: null, life: null
//     }

//     const { timeScope }: any = pathParams
//     let useDayData = false
//     let useLifeData = false

//     const achievementHolderTimeScopeMap: any = {
//         today: day ? day : null,
//         thisWeek: week ? week : null,
//         thisMonth: month ? month : null,
//         lifetime: life ? life : null
//     }

//     const ahCurrentPeriod = Object.assign({}, achievementHolderTimeScopeMap[timeScope])
//     console.log('TCL: ahCurrentPeriod', ahCurrentPeriod)

//     function isBelowThreshold(element: any, index: any, array: any) {
//         return !ahCurrentPeriod[element].user || ahCurrentPeriod[element].user === null
//     }
    
//     const allAchievementValuesForPeriodNull = Object.keys(ahCurrentPeriod).every(isBelowThreshold)
//     console.log('TCL: allAchievementValuesForPeriodNull', allAchievementValuesForPeriodNull)

//     if (allAchievementValuesForPeriodNull && timeScope === 'thisWeek') {
//         useDayData = true
        
//         console.log('all Achievement Values For Period are in fact Null')
//         console.log('TCL: useDayData', useDayData)
//     }

//     if (allAchievementValuesForPeriodNull && timeScope === 'thisMonth') {
//         useLifeData = true
        
//         console.log('all Achievement Values For Period are in fact Null')
//         console.log('TCL: useLifeData', useLifeData)
//     }

  

//     useEffect(() => {
//         let currentPeriod = useDayData ? Object.assign({}, achievementHolderTimeScopeMap.today) : useLifeData ? Object.assign({}, achievementHolderTimeScopeMap.lifetime) : Object.assign({}, ahCurrentPeriod)

//         for (let place in currentPeriod) {
//             if (!currentPeriod[place].user) {
//                 currentPeriod[place] = null
//             }
//         }

//         setCurrentPeriodAchievementHolders(currentPeriod)
 
//     }, [topArtistsWithAchievementHolders, propsArtist, pathParams])


//     const { total, status } = comparePersonalAndGroupScore(totalTimeListened, groupScore)
//     console.log('TCL: status', status)
//     console.log('TCL: total', total)
//     const currentUserIsTopListener: any = status
 

//     const { first = null, second = null, third=null } = currentPeriodAchievementHolders ? currentPeriodAchievementHolders : {
//         first: null,
//         second: null,
//         third: null
//     }

//     console.log('TCL: third', third)
//     console.log('TCL: second', second)
//     console.log('TCL: first', first)
//     console.log('TCL: currentPeriodAchievementHolders', currentPeriodAchievementHolders)
//     const title: any = normalizeTimeScope(pathParams)
//     const topBadge = currentUserIsTopListener ? firstPlaceBadge : first && first.user.photoURL ? first.user.photoURL : second && second.user.photoURL ? second.user.photoURL : '/icons/headphones.svg'
    
    
//     const topSpot: any = <image href={topBadge} transform={`translate(${(x || 0) + 15}, ${(y || 0) - 20})`} width='30px' height='30px'
//     />
    

//     const content = <AchievementHoldersList artist={propsArtist} {...{achievementHolders }} style={{
//         background: '#030616!important'
//     }} />

//     console.count('AchievementHolder PopUp Rendered:')


//     return (

//         <PopOverStyle placement="topLeft" content={content} title={propsArtist ? `${propsArtist.name}'s Top Listeners` : null} trigger="click"
//             visible={visible} style={{
//                 background: '#030616!important'
//             }}>
//             <TopListenerLink handleClick={handleClick}>
//                 {topSpot}
//             </TopListenerLink>
//         </PopOverStyle>

//     );
// }

// export const TopListenerYaxis: React.SFC<TickProps & any> = ({ x, y, offset, artist=null, pathParams, userId, totalTimeListened, groupScore }) => {


//     const [visible, setVisible] = useState(false)
//     const handleClick = () => setVisible(visible => !visible)
//     console.count('TopListenerYaxis render')


//     return artist ? <AchievementHoldersPopUp {...{ x, y, offset, artist, pathParams, userId, totalTimeListened, groupScore, visible, handleClick }} /> : null

// }



