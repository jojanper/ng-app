/**
 * Configure RequireJS.
 */
require.config({

    preserveLicenseComments : false,

    paths: {
        // Configure alias to full paths; relative to `baseURL`
        'apps': './apps',
        'utils' : './utils',
        'common' : './utils/common',
        //'controllers' : './utils/controllers',
        //'directives' : './utils/directives',
        //'services' : './utils/services',

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
        'angular-cookies': '../components/angular-cookies/angular-cookies',
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
        'flowplayer-flash': {
            deps: ['jquery'],
            exports: 'jquery'
        },
        'flowplayer': {
            deps: ['jquery'],
            exports: 'flowplayer'
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
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-loading-bar': {
            deps: ['angular']
        },
        'ng-file-upload': {
            deps: ['angular']
        },
        'angular-resource': {
            deps : ['angular'],
            exports : 'ngResource'
        },
        'angular-animate': {
            deps : ['angular'],
            exports : 'ngAnimate'
        },
        'angular-cookies': {
            deps : ['angular'],
            exports : 'ngCookies'
        },
        'ui.select': {
            deps: ['angular']
        },
        'ui.bootstrap': {
            deps: ['angular']
        },
        'ui.router': {
            deps: ['angular']
        },
        'ngSanitize': {
            deps: ['angular']
        }
    },

    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
});
