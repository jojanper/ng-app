/**
 * Angular loading bar configuration.
 *
 */
define([
], function () {
    "use strict";

    var LoadingBarConfig = function ($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
        // set loading bar preferences
        cfpLoadingBarProvider.includeSpinner = true;

        // only show the loading bar if the resolve takes more than 1 second. this prevents the user
        // from seeing the loading bar flash on the screen when the resolve completes quickly.
        cfpLoadingBarProvider.latencyThreshold = 10;
    };

    var LoadingBarRunner = function ($rootScope, cfpLoadingBar) {
        $rootScope.$on("$stateChangeStart", function () {
            // show the loading bar when we start to change to a new page. This is mostly for states that
            // perform a resolve() to retrieve data before loading the next state.
            cfpLoadingBar.start();
        });

        $rootScope.$on("$stateChangeSuccess", function () {
            // hide the loading bar
            cfpLoadingBar.complete();
        });

        $rootScope.$on("$stateChangeError", function () {
            // hide the loading bar
            cfpLoadingBar.complete();
        });
    };

    function initConfig(app) {
        app.config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider', LoadingBarConfig]);
        app.run(['$rootScope', 'cfpLoadingBar', LoadingBarRunner]);
    }

    return initConfig;
});
