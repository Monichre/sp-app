import { mergeSchemas } from 'graphql-tools';
import { insightsStatsSchema } from './insightsStats'
import { insightsDashSchema } from './insightsDash';
import { insightsArtistsSchema } from './insightsArtists';
import { insightsGenresSchema } from './insightsGenres';
import { insightsArtistStatsSchema } from './insightsArtistStats';
import { insightsGenreStatsSchema } from './insightsGenreStats';

export const statSchema = mergeSchemas({
  schemas: [
    insightsStatsSchema,
    insightsDashSchema,
    insightsArtistsSchema,
    insightsGenresSchema,
    insightsArtistStatsSchema,
    insightsGenreStatsSchema,
   ]
})
