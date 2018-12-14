const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: "./src/app.jsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
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
