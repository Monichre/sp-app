



/*==========================================================================================
=            Shared Functions            =
==========================================================================================



 *
 *
 * Encode Put Values
 *
 *

const encodeAchievement = ({
    artistId,
    achievementType,
    achievementValue,
    periodType,
    periodValue,
    date,
    uid,
    ...rest
}: Achievement) => ({
    pk: makePk(artistId, achievementType, periodType, periodValue),
    sk: makeSk(artistId, achievementValue, periodType, periodValue, date),

    ...rest
})




/*=====  End of Shared Functions  ======*/

