const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        "home": './pages/home/home.ts',
        "onlineTV": './pages/onlineTV/onlineTV.ts',
        "programTV": './pages/programTV/programTV.ts',
        "banner": './pages/banner/banner.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].css",
                        },
                    },
                    "extract-loader",
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        },
                    }
                ],
            },
        ]
    }
};