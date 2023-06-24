const path = require('path');
const { merge } = require('webpack-merge');
const Terser = require('terser-webpack-plugin');

const config = require('./webpack.config.js');

module.exports = merge(config, {
    mode: 'production',
    
    output: {
        filename: '[name].min.js'
    },

    optimization: {
        minimizer: [new Terser({
            test: /\.js$/,
            terserOptions: {
                format: {
                    ascii_only: true
                }
            }
        })]
    },

    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'esbuild-loader',
                    options: {
                        targets: 'es2015'
                    }
                } 
            }
        ]
    },

    resolveLoader: {
        alias: {
            'utf-loader': path.resolve(__dirname, 'src/loaders/utf.loader.js')
        }
    },
});
