const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// const getHtmlWebpackPlugins = function thisFunc(dir = "pages") {
//     const files = fs.readdirSync(path.resolve(__dirname, dir), { withFileTypes: true });
//     let plugins = [];
//     for (let file of files) {
//         if (file.isDirectory()) {
//             plugins = plugins.concat(thisFunc(path.join(dir, file.name)));
//         } else if (file.name.endsWith(".html")) {
//             plugins.push(new HtmlWebpackPlugin({ template: path.join(dir, file.name) }));
//         }
//     }
//     return plugins;
// }

module.exports = {
    mode: "production",
    entry: {
        "home-advertising": './pages/home-advertising/home-advertising.ts',
        "programs": './pages/programs/programs.ts',
        "scheldule": './pages/scheldule/scheldule.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            // {
            //     test: /\.html$/,
            //     use: [
            //         {
            //             loader: "file-loader",
            //             options: {
            //                 name: "[name].html",
            //             },
            //         },
            //         "extract-loader",
            //         {
            //             loader: 'html-loader',
            //             options: {
            //                 interpolate: true
            //             }
            //         }
            //     ],
            // },
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
                    },
                ],
            },
        ]
    }
};