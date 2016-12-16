/**
 * Defines the main routes in the application. The routes you see here will be
 * anchored as '#/' unless specifically configured otherwise.
 */
define([
    './app',
    './apps/ui_router',
    'utils/config/http_provider',
    'utils/config/loading_bar',
    'utils/config/http_duplicate_requests'
], function (app, UIRouter, HttpProviderConfig, LoadingBarConfig, DuplicateRequestsConfig) {
    'use strict';

    // Initialize various configs
    var configObj;

    configObj = new HttpProviderConfig(app);
    configObj = new LoadingBarConfig(app);
    configObj = new DuplicateRequestsConfig(app);

    return app.config(UIRouter.manager);
});
