const path = require('path');

module.exports = {
    mode: "production",
    entry: {
        "client/home": './pages/client/home/home.ts',
        "client/onlineTV": './pages/client/onlineTV/onlineTV.ts',
        "client/programTV": './pages/client/programTV/programTV.ts',
        "admin/home": './pages/admin/home/home.ts',
        "admin/programs": './pages/admin/programs/programs.ts',
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
                            name(filePath) {
                                filePath = filePath.substring(__dirname.length + 1);
                                if (/[\/\\]admin[\/\\]/.test(filePath)) {
                                    return path.normalize("admin/[name].css");
                                } else if (/[\/\\]client[\/\\]/.test(filePath)) {
                                    return path.normalize("client/[name].css");
                                } else {
                                    return "[name].css";
                                }
                            },
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