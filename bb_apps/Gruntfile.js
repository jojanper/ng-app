/**
 * Grunt file for Backbone based UI apps.
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('../package.json'),
        appPath: '.',
        distPath: './apps',
        distCssPath: './apps/css/',
        cssPath: './draal_apps/css',
        cssjQueryPath: './draal_apps/css/components/jquery-ui-1.11.1.custom',
        makeBuildPath: './draal_apps/build',

        /**
         * Build via makefile
         */
        bgShell: {
            _defaults: {
                bg: false
            },
            build: {
                execOpts: {
                    cwd: '<%= makeBuildPath %>',
                },
                cmd: 'make install'
            },
            build_dev: {
                execOpts: {
                    cwd: '<%= makeBuildPath %>',
                },
                cmd: 'make install-dev'
            },
            clean: {
                execOpts: {
                    cwd: '<%= makeBuildPath %>',
                },
                cmd: 'make installclean'
            },

            /*
             * Prepate jQuery UI CSS for the app.
             */
            jqueryui_css: {
                execOpts: {
                    cwd: '<%= appPath %>',
                },
                cmd: 'cp -r <%= cssjQueryPath %>/*.min.css <%= cssjQueryPath %>/images <%= distCssPath %>'
            },
        },

        /**
         * r.js optimizer for (js and) css
         */
        requirejs: {
            css: {
                options: {
                      optimizeCss: 'standard',
                      cssIn: '<%= cssPath %>/main.css',
                      out: '<%= distPath %>/css/draal.min.css'
                }
            }
        },

        /**
         * Compile SASS styles
         */
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    nonull: true,
                    cwd: '<%= cssPath %>/sass',
                    src: ['*.scss', '*/**.scss'],
                    dest: '<%= cssPath %>/app',
                    ext: '.css'
                }],
            },
            dev: {
                options: {
                    style: 'compact'
                },
                files: [{
                    expand: true,
                    nonull: true,
                    cwd: '<%= cssPath %>/sass',
                    src: ['*.scss', '*/**.scss'],
                    dest: '<%= cssPath %>/app',
                    ext: '.css'
                }],
            }
        },

        /**
         * jshint config
         */
        jshint: {
            files: ['<%= appPath %>/*/lib/**/*.js'],
            options: {
                globals: {
                    /* Don't add 'console' here because it should not be used
                    in production code, instead allow it in the .js file with
                    'global console: false' comment directive if needed. */

                    // Require.js
                    'define': false,
                    'require': false,

                    // Jasmine
                    'spyOn': false,
                    'it': false,
                    'describe': false,
                    'beforeEach': false,
                    'afterEach': false,
                    'expect': false,
                },
                forin: true,
                indent: 4,
                maxlen: 120,
                camelcase: true,
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                //quotmark: 'single',
                trailing: true,
                maxdepth: 3,
                browser: true,
                asi: true,
                debug: true,
                eqnull: true,
                undef: true,
                unused: true,
                trailing: true,
            },
        },
    });

    require('load-grunt-tasks')(grunt, ['grunt-*']);

    // Production distribution
    grunt.registerTask('dist', [
        'bgShell:clean',
        'bgShell:build',
        'sass:dist',
        'requirejs:css',
        'bgShell:jqueryui_css',
    ]);

    // Development distribution
    grunt.registerTask('dev', [
        'bgShell:clean',
        'bgShell:build_dev',
        'sass:dist',
        'requirejs:css',
        'bgShell:jqueryui_css',
    ]);

    // CSS compilation
    grunt.registerTask('css', [
        'bgShell:clean',
        'sass:dist',
        'requirejs:css',
        'bgShell:jqueryui_css',
    ]);

    // Clean environment
    grunt.registerTask('clean', [
        'bgShell:clean',
    ]);
};
