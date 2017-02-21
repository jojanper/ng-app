define([
    'underscore',
    'utils/models/user'
], function (_, User) {
    "use strict";

    // Routes that don't require authentication
    var noAuthRoutes = ['#!/home', '#!/auth/login'];

    function validateRoute(route) {
        return _.find(noAuthRoutes, function (noAuthRoute) {
            return route.startsWith(noAuthRoute);
        });
    }

    // Name of cookie key that contains authorization data
    var userCookieName = 'authUser';

    // Cookie management related to user authentication data
    function CookieMgr($cookies, user) {
        this.set = function(authData) {
            var cookieExp = new Date();
            cookieExp.setDate(authData.expires);
            $cookies.putObject(userCookieName, authData, {expires: cookieExp});
            user.setLoginData(this.get());
            return this;
        };

        this.get = function() {
            return $cookies.getObject(userCookieName) || {};
        };

        this.remove = function() {
            $cookies.remove(userCookieName);
            user.reset();
            return this;
        };
    }

    var name = 'dngUserManagement';

    /**
     * @ngdoc service
     * @name dngUserManagement
     *
     * @description
     * User management.
     */
    var UserManagementService = function($rootScope, $location, $cookies, rest) {

        this.$$name = name;

        this.user = new User();
        $rootScope.user = this.user;

        var cookieObj = new CookieMgr($cookies, this.user);
        this.user.setLoginData(cookieObj.get());

        /**
         * @ngdoc
         * @name canAccess
         * @methodOf dngUserManagement
         *
         * @description
         * Validate access to route.
         *
         * @param {string} route Target route.
         */
        this.canAccess = function($state, event, toState, toParams) {

            console.log(toState);

            // Set authentication status
            this.user.setLoginData(cookieObj.get());

            // User must be authenticated
            if (this.user.isAuthenticated()) {
                return true;
            }

            // Make sure unauthenticated user is able to see public views only
            var route = $state.href(toState.name, toParams);
            var routeStatus = validateRoute(route);

            // Route requires authentication
            if (!routeStatus) {
                event.preventDefault();
                $state.go('auth.login', {
                    redirect: route
                });
            }

            return false;
        };

        /**
         * @ngdoc
         * @name login
         * @methodOf dngUserManagement
         *
         * @description
         * Login user to remote system.
         *
         * @param {Object} credentials Sign-in credentials.
         */
        this.login = function(credentials) {
            rest.login(credentials).then(function(response) {
                cookieObj.set(response);
                $location.path('/');
            });
        };

        /**
         * @ngdoc
         * @name logout
         * @methodOf dngUserManagement
         *
         * @description
         * Logout user from remote system.
         */
        this.logout = function($state) {
            rest.logout().then(function() {
                cookieObj.remove();
                $state.go('auth.login');
            });
        };
    };

    return {
        feature: 'service',
        name: name,
        cls: ['$rootScope', '$location', '$cookies', 'rest', UserManagementService]
    };
});
