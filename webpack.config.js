const path = require('path');

module.exports = {
    mode: 'production',
    target: ['web', 'es5'],
    context: path.resolve(__dirname, 'src'),
    entry: {
        ScheduleMerger: './public/ScheduleMerger.js',
        ScheduleSitter: './public/ScheduleSitter.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.m?js/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        targets: 'defaults, ie 11'
                    }
                }
            }
        ]
    }
};
