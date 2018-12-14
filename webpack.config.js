const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports =
{
    mode: "development",
    entry: "./src/app.jsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    devServer: {
        disableHostCheck: true,
        host: "0.0.0.0",
        port: 8760,
        overlay: true,
        contentBase: "./dist",
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: ["@babel/plugin-proposal-class-properties"],
                    },
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                title: "Cart Keeper",
                filename: path.resolve(__dirname, "dist", "index.html"),
                hash: true,
                meta: {
                    viewport: "width=device-width, initial-scale=1"
                },
            }
        ),
    ],
};
