/**
 * @description
 * URL path resolver.
 */
define([], function () {
    "use strict";

    var baseUrl = backendConfig.baseUrl;
    var authUrls = backendConfig.authUrls;

    /**
     * Resolve URL path to actual HTTP callable URL.
     *
     * @param {String} name URL path name.
     * @param {Dict} data URL path data.
     * @return Resolved URL.
     */
    var UrlResolve = function(name, data) {
        var url = [];

        // URL to list available models
        if (name === 'rest-api-models') {
            url = [baseUrl];
        }

        // URL to fetch model data listing
        else if (name === 'rest-api') {
            url = [baseUrl, data.appLabel, data.model];
        }

        // URL to fetch model meta data
        else if (name === 'rest-api-model-meta') {
            url = [baseUrl, data.appLabel, data.model, 'meta'];
        }

        // URL to model action
        else if (name === 'rest-api-actions') {
            url = [baseUrl, data.appLabel, data.model, 'actions', data.action];
        }

        // URL to model item details
        else if (name === 'rest-api-model-id') {
            url = [baseUrl, data.appLabel, data.model, data.modelId];
        }

        // URL to model item change history
        else if (name === 'rest-api-model-id-history') {
            url = [baseUrl, data.appLabel, data.model, data.modelId, 'history'];
        }

        // URL to model item action
        else if (name === 'rest-api-model-actions') {
            url = [baseUrl, data.appLabel, data.model, data.modelId, 'actions', data.action];
        }

        // URL to application action
        else if (name === 'rest-api-app-actions') {
            url = [baseUrl, data.appLabel, 'actions', data.action];
        }

        // Try authentication URLs
        else if (authUrls[name]) {
            url = [authUrls[name]];
        }

        return url.join('/');
    };

    return UrlResolve;
});
