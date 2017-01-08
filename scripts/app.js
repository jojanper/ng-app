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
    'angular-animate',
    'angular-loading-bar',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'ngSanitize',
    './apps/test/module',
    './apps/media/module',
    './apps/player/module',
    './utils/module'
], function ($, datatables, readmore, angular, angularRoute, angularResource, angularAnimate,
             angularLoadingBar, AngularBootstrap, angularUiRouter, AngularUiSelect, ngSanitize,
             TestModule, MediaModule, PlayerModule, UtilsModule) {
    'use strict';

    return angular.module('app', [
        'ngRoute',
        'ngResource',
        'angular-loading-bar',
        'ngAnimate',
        'ui.router',
        'ui.select',
        'ngSanitize',
        'ui.bootstrap',
        UtilsModule,
        TestModule,
        MediaModule,
        PlayerModule
    ]);
});
