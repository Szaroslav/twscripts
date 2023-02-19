const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',

    entry: {
        index: './src/index.ts',
    },

    devtool: 'inline-source-map',

    devServer: {
        port: 8000,
        hot: true,
        devMiddleware: {
            writeToDisk: true,
        },
        watchFiles: ['src/**/*.php'],
        proxy: {
            '/': {
                target: 'http://127.0.0.1:7888/tw/applications/coords/dist',
                secure: false,
            },
        },
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: 'src/index.php',
            filename: 'index.php',
        }),
        new CleanWebpackPlugin(),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            proxy: 'http://localhost:8000',
        }),
    ],

    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        extensionAlias: {
            '.js': ['.js', '.ts'],
            '.cjs': ['.cjs', '.cts'],
            '.mjs': ['.mjs', '.mts'],
        },
    },

    module: {
        rules: [
            {test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader'},
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', {targets: 'defaults'}]],
                    },
                },
            },
        ],
    },

    optimization: {
        runtimeChunk: 'single',
    },
};
