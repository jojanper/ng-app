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
    'angular-cookies',
    'angular-loading-bar',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'ngSanitize',
    './apps/test/module',
    './apps/media/module',
    './apps/player/module',
    './utils/module',
    './utils/config/configs',
    './apps/ui_router'
], function ($, datatables, readmore, angular, angularRoute, angularResource, angularAnimate,
             angularCookies, angularLoadingBar, AngularBootstrap, angularUiRouter, AngularUiSelect,
             ngSanitize, TestModule, MediaModule, PlayerModule, UtilsModule, Configs, UIRouter) {
    'use strict';

    var app = angular.module('app', [
        'ngRoute',
        'ngResource',
        'angular-loading-bar',
        'ngAnimate',
        'ngCookies',
        'ui.router',
        'ui.select',
        'ngSanitize',
        'ui.bootstrap',
        UtilsModule,
        TestModule,
        MediaModule,
        PlayerModule
    ]);

    // Initialize various configs
    for (var i = 0; i < Configs.length; i++) {
        Configs[i](app);
    }

    app.config(UIRouter.manager);

    return app;
});
