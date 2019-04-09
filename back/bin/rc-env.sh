# queues
export QueueEndpoint=https://sqs.us-east-1.amazonaws.com/726906999379
export QueueHiFetchSpotifyPlays=$QueueEndpoint/sp-app-back-rc-QueueHiFetchSpotifyPlays
export QueueStartHarvestUser=$QueueEndpoint/sp-app-back-rc-QueueStartHarvestUser
export QueueEnrichPlayArtists=$QueueEndpoint/sp-app-back-rc-QueueEnrichPlayArtists

# tables
export DynamoEndpoint=https://dynamodb.us-east-1.amazonaws.com
export TableUser=sp-app-back-rc-TableUser
export TablePlay=sp-app-back-rc-TablePlay
export TableStat=sp-app-back-rc-TableStat

# streams
# export StreamCreatePlayFromSpotify=sp-app-back-local-StreamCreatePlayFromSpotify

