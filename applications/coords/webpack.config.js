const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',

    entry: {
        index: './src/index.ts',
    },

    devtool: 'inline-source-map',

    devServer: {
        static: './dist',
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: 'src/index.html',
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
