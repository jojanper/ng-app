/**
 *  Use RequireJS to configure and launch Karma testing for the specified Karma
 *  test *Spec.js files.
 *
 *  This code does two (2) things:
 *
 *  1 ) Configures requireJS with settings needed by all the `define()` code blocks
 *  2 ) Auto-starts Karma with the requireJS completion-callback; using `window.__karma__.start`
 *
 */

(function(requirejs) {
    "use strict";

    var tests = [];
    for (var file in window.__karma__.files) {
        if (/Spec\.js$/.test(file)) {
            tests.push(file);
        }
    }

    requirejs.config({

        // Karma serves files from '/base'
        baseUrl: '/base/scripts',

        preserveLicenseComments : false,

        paths: {
            // Configure alias to full paths; relative to `baseURL`
            'apps': './apps',
            'utils' : './utils',
            'common' : './utils/common',

            'jquery': '../components/jquery/dist/jquery',
            "jquery.ui": "../components/jquery-ui/jquery-ui",
            'datatables': '../components/DataTables/media/js/jquery.dataTables',
            "readmore": "../vendor/readmore",
            'timeago': '../components/jquery-timeago/jquery.timeago',
            'flowplayer-flash': '../components/flowplayer-flash/flowplayer.min',
            'flowplayer': '../node_modules/flowplayer/dist/flowplayer.min',

            "underscore": "../components/underscore-amd/underscore",

            'angular': '../components/angular/angular',
            'angular-route': '../components/angular-route/angular-route',
            'angular-resource': '../components/angular-resource/angular-resource',
            'angular-animate': '../components/angular-animate/angular-animate',
            'ui.router' : "../components/angular-ui-router/release/angular-ui-router",
            'angular-loading-bar': '../components/angular-loading-bar/build/loading-bar',
            'ui.select': "../components/angular-ui-select/dist/select",
            'ngSanitize': "../components/angular-sanitize/angular-sanitize",
            'ui.bootstrap': "../components/angular-bootstrap/ui-bootstrap-tpls",
            'ng-file-upload': "../components/ng-file-upload/ng-file-upload",

            'domReady': '../components/requirejs-domready/domReady',
            "requireLib": "../components/requirejs/require",
            "text": "../components/requirejs-text/text"
        },

        include: ['requireLib'],

        /**
         * for libs that either do not support AMD out of the box, or
         * require some fine tuning to dependency mgt'
         */
        shim: {
            'jquery': {
                exports: 'jquery'
            },
            'jquery.ui': {
                deps: ['jquery'],
                exports: 'jquery'
            },
            'datatables': {
                deps: ['jquery'],
                exports: 'jquery'
            },
            'readmore': {
                deps: ['jquery'],
                exports: 'jquery'
            },
            'timeago': {
                deps: ['jquery'],
                exports: 'jquery'
            },
            'angular': {
                exports: 'angular'
            },
            'angular-route': {
                deps: ['angular']
            },
            'angular-loading-bar': {
                deps: ['angular']
            },
            'angular-resource': {
                deps : ['angular'], 'exports' : 'ngResource'
            },
            'angular-animate': {
                deps : ['angular'], 'exports' : 'ngAnimate'
            },
            'ui.router' : ['angular']
        },

        priority: ["angular"],

        // ask Require.js to load these test *Spec.js files
        deps: tests,

        // start test run, once Require.js is done
        callback: window.__karma__.start
    });

    var dependencies = [
        'angular'
    ];

    /**
     * Register the class with RequireJS
     *
     * Notice: the dependencies are NOT used as arguments
     */
    require(dependencies, function (angular) {
        // Prepare `test` module for all the specs (if needed)
        // Provide contextRoot for all `live` delegate testing
        angular.module('test.draal-apps', []);
    });

}) (requirejs);
