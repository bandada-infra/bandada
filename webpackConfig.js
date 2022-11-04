const { merge } = require("webpack-merge")
const webpack = require("@nrwl/react/plugins/webpack")

module.exports = (config, context) => {
    return merge(webpack(config, context), {
        resolve: {
            fallback: {
                os: false,
                crypto: false,
                assert: require.resolve("assert"),
                stream: false
            }
        }
    })
}
