const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        disableHostCheck: true,
        host: "0.0.0.0",
        port: 8760,
        overlay: true,
        contentBase: "./dist",
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                pathRewrite: {"^/api": ""},
            },
        },
    },
});
