define([
    'underscore',
    'utils/models/user'
], function (_, User) {
    "use strict";

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
    var UserManagementService = function($rootScope, $location, $cookies, rest, appMessagesService) {

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

            // Set authentication status
            this.user.setLoginData(cookieObj.get());

            // User must be authenticated
            if (this.user.isAuthenticated()) {
                return true;
            }

            // Make sure unauthenticated user is able to see public views only
            // Route requires authentication
            if (!toState.public) {
                event.preventDefault();
                $state.go('auth.login', {
                    redirect: $state.href(toState.name, toParams)
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
            rest.authAction('login', credentials).then(function(response) {
                cookieObj.set(response);
                $location.path('/');
            });
        };

        /**
         * @ngdoc
         * @name reset
         * @methodOf dngUserManagement
         *
         * @description
         * Reset user authorization state.
         */
        this.reset = function($state) {
            cookieObj.remove(this.user);
            $state.go('auth.login');
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
            var self = this;
            rest.authAction('logout').then(function() {
                self.reset($state);
            });
        };

        /**
         * @ngdoc
         * @name register
         * @methodOf dngUserManagement
         *
         * @description
         * Create new user.
         */
        this.register = function(data, $state) {
            /* jshint camelcase: false */
            data.first_name = '';
            data.last_name = '';
            /* jshint camelcase: true */
            rest.authAction('register', data).then(function(response) {
                appMessagesService.addMessage({type: "success", msgBody: response});
                $state.go('auth.login');
            });
        };

        /**
         * @ngdoc
         * @name activate
         * @methodOf dngUserManagement
         *
         * @description
         * Activate user account.
         */
        this.activate = function(activationKey, $state) {
            rest.authAction('activate', {'activation_key': activationKey}).then(function() {
                appMessagesService.addMessage({type: "success", msgBody: 'Your account is now activated'});
                $state.go('auth.login');
            }).catch(function() {});
        };

        /**
         * @ngdoc
         * @name passwordChange
         * @methodOf dngUserManagement
         *
         * @description
         * Change user password.
         */
        this.passwordChange = function(data, $state) {
            rest.authAction('password-change', data).then(function() {
                appMessagesService.addMessage({type: "success", msgBody: 'Your password has been changed'});
                $state.go('home');
            }).catch(function() {});
        };
    };

    return {
        feature: 'service',
        name: name,
        cls: ['$rootScope', '$location', '$cookies', 'rest', 'appMessagesService', UserManagementService]
    };
});
