const nodeExternals = require("webpack-node-externals");
const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  resolve: {
    extensions: [".js", ".json", ".ts"]
  },
  target: "node",
  devtool: "source-map",
  externals: [nodeExternals()],
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "graphql-tag/loader"
          }
        ]
      }
    ]
  }
};
