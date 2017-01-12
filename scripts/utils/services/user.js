define([
    'utils/models/user'
], function (User) {
    "use strict";

    var name = 'dngUserMgr';

    /**
     * @ngdoc service
     * @name dngUserMgr
     *
     * @description
     * User management.
     */
    var UserManagementService = function($rootScope, $location, network) {

        this.$$name = name;

        this.user = new User();

        /**
         * @ngdoc
         * @name login
         * @methodOf dngUser
         *
         * @description
         * Login user to remote system.
         *
         * @param {string} url Target URL.
         * @param {string} username Username.
         * @return {string} password Password.
         */
        this.login = function(url, username, password) {
            network.post(url, {username: username, password: password}).then(function() {
                $location.path('/');
            });
        };
    };

    return {
        feature: 'service',
        name: name,
        cls: ['$rootScope', '$location', 'network', UserManagementService]
    };
});
