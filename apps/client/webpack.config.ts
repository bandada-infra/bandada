import { merge } from "webpack-merge"
import { DefinePlugin, ProvidePlugin, Configuration } from "webpack"

export default (config: Configuration) => {
    return merge(config, {
        resolve: {
            fallback: {
                assert: require.resolve("assert"),
                stream: false,
                crypto: false,
                os: false
            }
        },
        plugins: [
            new DefinePlugin({
                global: "window"
            }),
            new ProvidePlugin({
                process: "process/browser",
                Buffer: ["buffer", "Buffer"]
            })
        ]
    })
}
