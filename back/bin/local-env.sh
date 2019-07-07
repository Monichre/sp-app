# queues
export QueueEndpoint=http://0.0.0.0:9324/queue
export QueueHiFetchSpotifyPlays=$QueueEndpoint/sp-app-back-local-QueueHiFetchSpotifyPlays
export QueueStartHarvestUser=$QueueEndpoint/sp-app-back-local-QueueStartHarvestUser
export QueueEnrichPlayArtists=$QueueEndpoint/sp-app-back-local-QueueEnrichPlayArtists
export QueueValidationErrors=$QueueEndpoint/sp-app-back-local-QueueValidationErrors

# tables
export DynamoEndpoint=http://localhost:8888
export TableUser=sp-app-back-local-TableUser
export TablePlay=sp-app-back-local-TablePlay
export TableStat=sp-app-back-local-TableStat
export TableAchievement=sp-app-back-local-TableAchievement

# streams
export StreamCreatePlayFromSpotify=sp-app-back-local-StreamCreatePlayFromSpotify

export AWS_REGION=us-east-1