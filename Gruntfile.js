require('shelljs/global');
var path = require('path');
var config = require('./env.js');

mkdir('-p', config.testReportsFolder);

module.exports = function(grunt) {

    if (grunt.option('jenkins')) {
        process.env.IS_JENKINS = true;
    }

    if (grunt.option('travis')) {
        process.env.IS_TRAVIS = true;
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

            testReportsPath: '<%= appPath %>/' + config.testReportsFolder,
            jsHintXml: '<%= testReportsPath %>/jshint.xml',
            jsCSXml: '<%= testReportsPath %>/jshint_jscs.xml',
            docsPath: '<%= appPath %>/' + config.docsFolder,
        }
    });
};
