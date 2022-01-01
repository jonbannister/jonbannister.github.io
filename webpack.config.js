module.exports = {
    entry: "./src/js/main.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
        library: "MainLibrary",
        libraryTarget: "var"
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }]
    }
};