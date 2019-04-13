# queues
export QueueEndpoint=https://sqs.us-east-1.amazonaws.com/726906999379
export QueueHiFetchSpotifyPlays=$QueueEndpoint/sp-app-back-$TARGET-QueueHiFetchSpotifyPlays
export QueueStartHarvestUser=$QueueEndpoint/sp-app-back-$TARGET-QueueStartHarvestUser
export QueueEnrichPlayArtists=$QueueEndpoint/sp-app-back-$TARGET-QueueEnrichPlayArtists
export QueueValidationErrors=$QueueEndpoint/sp-app-back-$TARGET-QueueValidationErrors

# tables
export DynamoEndpoint=https://dynamodb.us-east-1.amazonaws.com
export TableUser=sp-app-back-$TARGET-TableUser
export TablePlay=sp-app-back-$TARGET-TablePlay
export TableStat=sp-app-back-$TARGET-TableStat

# streams
# export StreamCreatePlayFromSpotify=sp-app-back-local-StreamCreatePlayFromSpotify

