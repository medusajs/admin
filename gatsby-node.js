exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-json-view/,
            use: loaders.null(),
          },
          {
            test: /emoji-picker-react/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
      },
    },
  })
}
