/**
 * Intercept HTTP requests.
 */
define([
], function () {
    "use strict";

    var _$location, _$state, _dngUserManagement;

    var HttpProviderConfig = function ($httpProvider) {
        var ngTemplatePrefix = 'ng-templates/';

        // CSRF token for POST forms etc
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';

        // CSRF token used for AJAX calls
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        // Application version ID for AJAX calls
        $httpProvider.defaults.appVersion = 'app-version';


        $httpProvider.interceptors.push(['$q', function($q) {
            return {
                'request': function(request) {
                    // Load templates from different server url prefix
                    if (backendConfig.templatePrefix && request.url.indexOf(ngTemplatePrefix) > -1) {
                        var server = _$location.protocol() + '://' + _$location.host() + ':' + _$location.port();
                        server += backendConfig.templatePrefix + request.url.substring(ngTemplatePrefix.length);
                        request.url = server;
                    }

                    return request || $q.when(request);
                },

                'responseError': function(response) {
                    // Reset user authentication status on authentication error
                    if (response.status === 401) {
                        _dngUserManagement.reset(_$state);
                    }

                    return $q.reject(response);
                }
            };
        }]);
    };

    /*
     * Only providers and constants may be injected into configuration blocks.
     *
     * From the angularjs documentation on configuration blocks
     *
     * Configuration blocks - get executed during the provider registrations and configuration phase.
     * Only providers and constants can be injected into configuration blocks. This is to prevent accidental
     * instantiation of services before they have been fully configured
     *
     * Run blocks - get executed after the injector is created and are used to kickstart the application.
     * Only instances and constants can be injected into run blocks. This is to prevent further system configuration
     * during application run time.
     */
    function initConfig(app) {
        app.run(['$location', '$state', 'dngUserManagement', function ($location, $state, dngUserManagement) {
            _$location = $location;
            _$state = $state;
            _dngUserManagement = dngUserManagement;
        }]);

        app.config(['$httpProvider', HttpProviderConfig]);
    }

    return initConfig;
});
