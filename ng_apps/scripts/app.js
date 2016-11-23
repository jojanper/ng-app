/**
 * Loads sub modules and wraps them up into the main module,
 * this should be used for top-level module definitions only
 */
define([
    'jquery',
    'datatables',
    'readmore',
    'angular',
    'angular-route',
    'angular-resource',
    'angular-loading-bar',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'ngSanitize',
    './apps/test/module',
    './apps/playlist/module',
    './apps/media/module',
    './apps/player/module',
    './utils/module'
], function ($, datatables, readmore, angular, angularRoute, angularResource, angularLoadingBar, AngularBootstrap,
             angularUiRouter, AngularUiSelect, ngSanitize, TestModule, PlaylistModule, MediaModule, PlayerModule,
             UtilsModule) {
    'use strict';

    return angular.module('app', [
        'ngRoute',
        'ngResource',
        'ui.router',
        'angular-loading-bar',
        'ui.select',
        'ngSanitize',
        'ui.bootstrap',
        UtilsModule,
        TestModule,
        PlaylistModule,
        MediaModule,
        PlayerModule
    ]);
});
