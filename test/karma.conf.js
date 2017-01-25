// Karma configuration
// Generated on Sun May 03 2015 18:25:19 GMT+0300 (EEST)

/**
 *  NodeJS configuration used for the Karma Server
 *
 *  This code does three (3) things:
 *  1 ) configures NodeJS Karma server with frameworks: Jasmine and RequireJS
 *  2 ) auto-loads the jQuery, AngularJS, and AngularJS Mock libs
 *  3 ) configures paths that should be included in the browser using <script> tag? or loaded them manually, eg. using Require.js.
 */

var path = require('path');
var appConfig = require('../nodejs/env');

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'jasmine.async', 'jasmine-matchers', 'requirejs', 'mocha', 'chai'],

        // list of files / patterns to load in the browser
        files: [
            // Global variables for testing
            'test/globals.js',

            // Testing utilities
            'test/test-utils.js',

            // Load these files in this order...
            'components/jquery/dist/jquery.js',
            'components/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',

            // Templates for loading via templateUrl
            "ng-templates/**/*.html",

            // Test responses
            'test/responses.js',

            // Load and run the RequireJS/Karma bootstrap
            'test/test-main.js',

            // Use `included = false` to let requireJS load them as needed
            // ... listed here so they can be resolved relative to the baseURL
            {pattern: 'scripts/**/*.js', included: false},
            {pattern: 'test/**/*.js', included: false},

            // when using RequireJS with Karma we must make sure that any files that
            // will be required as dependencies from the test specs are included in
            // the file list with the included: false option. This will make sure that
            // the script is not loaded twice (which causes the mismatch).
            {pattern: 'components/underscore-amd/*.js', included: false},
            {pattern: 'components/requirejs-text/*.js', included: false},
            {pattern: 'components/requirejs-domready/*.js', included: false},
            {pattern: 'components/ng-file-upload/*.js', included: false},
            {pattern: 'components/jquery-ui/*.js', included: false},
            {pattern: 'components/DataTables/media/js/*.js', included: false},
            {pattern: 'components/jquery-timeago/*.js', included: false},
            {pattern: 'vendor/*.js', included: false},
            {pattern: 'components/angular-*/**/*.js', included: false},
            {pattern: 'components/flowplayer-flash/*.js', included: false},
            {pattern: 'node_modules/flowplayer/dist/*.js', included: false},

            {pattern: 'test/assets/*.png', included: false, served: true},
            //{pattern: 'test/assets/*.png', included: false, served: true},

            // requirejs-text is handling templates, therefore HTML templates marked as dependencies
            {pattern: 'scripts/**/*.html', included: false},
        ],


        // list of files to exclude
        exclude: [
            'scripts/main.js'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            // exclude files that end with *dtplugin.js
            'scripts/**/!(*dtplugin).js': ['coverage'],

            // load the templates with the ng-html2js preprocessor
            // see http://stackoverflow.com/questions/15214760/unit-testing-angularjs-directive-with-templateurl
            "ng-templates/**/*.html": ["ng-html2js"]
        },

        ngHtml2JsPreprocessor: {
            // If your build process changes the path to your templates,
            // use stripPrefix and prependPrefix to adjust it.
            stripPrefix: "",
            prependPrefix: "",

            // the name of the Angular module to create
            moduleName: "app.templates"
        },

        proxies: {
            '/static/img/icons/music.png': 'http://localhost:9876/base/test/assets/music.png'
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'html', 'coverage'],


        // By adding this reporter to your karma configuration, unit test results will be
        // exported as a styled HTML file. For each test browser, a separate table is generated.
        htmlReporter: {
            outputFile: path.join(appConfig.testReportsFolder, 'units.html')
        },


        coverageReporter: {
            // specify a common output directory
            dir: path.join(appConfig.testReportsFolder, 'coverage'),
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
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
