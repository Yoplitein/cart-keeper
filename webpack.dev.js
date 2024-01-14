const {merge} = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        allowedHosts: "all",
        host: "0.0.0.0",
        port: 8760,
        client: {
            overlay: true,
        },
        static: "./dist",
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                pathRewrite: {"^/api": ""},
            },
        },
    },
});
