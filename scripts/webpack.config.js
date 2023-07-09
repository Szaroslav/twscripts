const path = require('path');

module.exports = {
    mode: 'development',
    target: ['web', 'es5'],
    context: path.resolve(__dirname, 'src'),

    entry: {
        // ScheduleMerger: './public/ScheduleMerger.js',
        ScheduleRemover: './public/ScheduleRemover.js',
        // ScheduleSitter: './public/ScheduleSitter.js',
        // SupportSender: './public/SupportSender/SupportSender.js',
        BarbarianWallDemolisher: './public/BarbarianWallDemolisher.js'
    },

    output: {
        path: path.resolve(__dirname, 'dist')
    }
};
