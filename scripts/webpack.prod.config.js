const path = require('path');
const fs = require('node:fs');
const { merge } = require('webpack-merge');
const Terser = require('terser-webpack-plugin');
const BannerPlugin = require('webpack').BannerPlugin;

const config = require('./webpack.config.js');

function generateComment(data) {
    const extensions = ['.js', '.mjs', '.ts'];
    const commentRegExp = /^\/\*\*.*\*\//s;
    let scriptComment = '';
    let i = 0;
    for (const extension of extensions) {
        try {
            const filePath = path.resolve(__dirname, 'src/public', `${data.chunk.name}${extension}`);
            const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
            if (commentRegExp.test(fileContent)) {
                scriptComment = fileContent.match(commentRegExp)[0] + "\n";
            }
        }
        catch {
            i++;
        }
    }
    if (i === extensions.length) {
        throw Error('File not found');
    }

    console.log(scriptComment);
    return scriptComment;
}

module.exports = merge(config, {
    mode: 'production',
    
    output: {
        filename: '[name].js',
        clean: true
    },

    optimization: {
        minimize: true,
        minimizer: [new Terser({
            test: /\.js$/,
            extractComments: false,
            terserOptions: {
                compress: false,
                format: {
                    comments: false,
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
                        target: 'es2015'
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

    plugins: [
        new BannerPlugin({ banner: generateComment, raw: true })
    ]
});
