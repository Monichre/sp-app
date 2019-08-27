import { useState, useEffect, useContext } from "react";
import { suspensefulHook } from '../../../../../lib/suspensefulHook';
import { useGetArtistAchievementHolders } from '../../../../../types';
import { UserAchievementContext } from '../../Authed';

export const useFetchAchievementHolders = (artistId: any, pathParams: any) => {
    const [achievementHolders, setAchievementHolders] = useState([])

    const fetchAchievementHolders = () => {
        const { getArtistAchievementHolders = null }: any = suspensefulHook(useGetArtistAchievementHolders({ variables: { artistId: artistId }, suspend: true })) 
        const { day = null, week = null, month = null, life = null } = getArtistAchievementHolders
        const { achievements, currentUser } = useContext(UserAchievementContext)
        const { timeScope }: any = pathParams
        
        const achievementHolderTimeScopeMap: any = {
            today: day ? day : null,
            thisWeek: week ? week : null,
            thisMonth: month ? month : null,
            lifetime: life ? life : null
        }
    
        const perspectiveAchievementHolders = Object.assign({}, achievementHolderTimeScopeMap[timeScope])
        
        for (let place in perspectiveAchievementHolders) {
            if (!perspectiveAchievementHolders[place].user) {
                perspectiveAchievementHolders[place] = null
            }
        }

        setAchievementHolders(perspectiveAchievementHolders)

    }


    useEffect(() => {
        fetchAchievementHolders()
    }, [])

    return [achievementHolders]
}