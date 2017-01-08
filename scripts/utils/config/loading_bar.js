/**
 * Angular loading bar configuration.
 */
define([
], function () {
    "use strict";

    var LoadingBarConfig = function ($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
        // set loading bar preferences
        cfpLoadingBarProvider.includeSpinner = true;

        // only show the loading bar if the resolve takes more than 1 second. this prevents the user
        // from seeing the loading bar flash on the screen when the resolve completes quickly.
        cfpLoadingBarProvider.latencyThreshold = 1000;
    };

    return function(app) {
        app.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', LoadingBarConfig]);
    };
});
