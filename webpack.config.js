module.exports = {
    entry: './app/js/main.js',
    output: {
        path: __dirname,
        filename: 'main.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    }
};