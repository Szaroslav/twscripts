const path = require('path');
const { globSync } = require('glob');

module.exports = {
    mode: 'development',
    target: ['web', 'es5'],
    context: path.resolve(__dirname, 'src'),

    entry: () => globSync('./src/*.js', { dotRelative: true }).reduce((accumulator, filePath) => {
        const pathSegments = filePath.split(/\/|\\/);
        const filename = pathSegments[pathSegments.length - 1];
        const filenameWithoutExtension = filename.slice(0, -3);
        accumulator[filenameWithoutExtension] = path.join('..', filePath);
        return accumulator;
    }, {}),

    output: {
        path: path.resolve(__dirname, 'dist')
    }
};
