var utils = require('../nodejs/utils');

var runner = {
    configFile: '<%= appTestsPath %>/karma.conf.js'
};

var continuousIntegration = utils.isJenkins();
if (!continuousIntegration) {
    continuousIntegration = process.env.IS_TRAVIS;
}

if (!continuousIntegration) {
    runner.coverageReporter = {
        // specify a common output directory
        dir: '<%= testReportsPath %>/coverage-unit',
        reporters: [
            // reporters not supporting the `file` property
            { type: 'html', subdir: 'report-html' },
            { type: 'lcov', subdir: 'report-lcov' },
            // reporters supporting the `file` property, use `subdir` to directly
            // output them in the `dir` directory
            { type: 'cobertura', subdir: '.', file: 'cobertura.xml' },
            { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
            { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
            { type: 'text', subdir: '.', file: 'text.txt' },
            { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
        ]
    };
}
else {
    runner.singleRun = true;
    if (process.env.IS_TRAVIS) {
        runner.browsers = ['Chrome_travis_ci'];
    }
    else {
        runner.browsers = ['PhantomJS'];
    }
    runner.reporters = ['mocha', 'junit', 'coverage'];
    runner.junitReporter = {
        outputFile: '<%= testReportsPath %>/test-results.xml'
    };
}

module.exports = function() {
    return {
        runner: runner
    };
};
