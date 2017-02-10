/**
 * Routing configuration for Angular UI Router.
 */
define([
    'apps/index/router',
    'apps/auth/router',
    'apps/player/router',
    'apps/media/router',
    'apps/test/router'
], function() {

    // Routing configurations from specified input apps, create flat array from modules
    var routes = [].concat.apply([], Array.prototype.slice.call(arguments, 0));

    var RouteManager = function ($stateProvider, $urlRouterProvider) {

        var urlDefault = null;

        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];

            var data = {};

            for (var key in route) {
                if (key) {
                    data[key] = route[key];
                }
            }

            data.url = '/' + (route.url || route.link);

            if (route.default) {
                urlDefault = data.url;
            }

            $stateProvider.state(route.link, data);
        }

        // If the url is ever invalid, e.g. '/asdf', then redirect to the default state
        if (urlDefault) {
            $urlRouterProvider.otherwise(urlDefault);
        }
    };

    return {
        manager: ["$stateProvider", "$urlRouterProvider", RouteManager],
        appMenu: routes
    };
});
