require('shelljs/global');

var testReportsFolder = 'test_reports';
mkdir('-p', testReportsFolder);

module.exports = function(grunt) {
    var path = require('path');

    if (grunt.option('jenkins')) {
        process.env.IS_JENKINS = true;
    }

    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {

        // Load grunt modules in just-in-time manner
        jitGrunt: {
            staticMappings: {
                replace: 'grunt-text-replace'
            }
        },

        // Path to task.js files, defaults to grunt dir
        configPath: path.join(process.cwd(), 'grunt'),

        // Data passed into config.
        data: {
            buildDate: grunt.template.today('isoDateTime'),

            appPath: path.resolve(),
            appScriptsPath: '<%= appPath %>/scripts',
            appTestsPath: '<%= appPath %>/test',
            appMainTemplate: '<%= appPath %>/ng-templates/ng-apps.html',
            appScriptsMainFile: '<%= appScriptsPath %>/main.js',

            distPath: '<%= appPath %>/dist',
            distScriptsPath: '<%= distPath %>/scripts',
            distJsName: 'draal-ng-<%= buildDate %>.min.js',
            distJsFile: '<%= distScriptsPath %>/<%= distJsName %>',

            testReportsPath: '<%= appPath %>/' + testReportsFolder,
            jsHintXml: '<%= testReportsPath %>/jshint.xml',
            jsCSXml: '<%= testReportsPath %>/jshint_jscs.xml'
        }
    });
};
