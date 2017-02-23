(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        describe('User management service', function() {

            var loginApi = '/api/auth/login';

            beforeEach(module('app'));

            var userService, $httpBackend, $location, $rootScope;

            beforeEach(function() {
                inject(function(_dngUserManagement_, _$httpBackend_, _$location_, _$rootScope_, $cookies) {
                    userService = _dngUserManagement_;
                    $httpBackend = _$httpBackend_;
                    $location = _$location_;
                    $rootScope = _$rootScope_;

                    // Make sure user authentication data is not available
                    $cookies.remove('authUser');
                });
            });

            it('supports user login', function() {

                spyOn($location, 'path').and.callThrough();
                $httpBackend.whenPOST(loginApi).respond(200, AppTestResponses.auth.loginResponse);

                // GIVEN user credentials
                var username = 'test';
                var password = 'test';

                // WHEN user does successful login
                userService.login({username: username, password: password});
                $httpBackend.flush();

                // THEN user is authenticated
                expect($rootScope.user.isAuthenticated()).toBeTruthy();

                // AND redirected to main page
                expect($location.path).toHaveBeenCalledWith('/');
            });

            it('login page can be accessed by unauthenticated user', function() {

                // GIVEN unauthenticated user wants to view login page
                // WHEN validating access to the view
                var status = userService.canAccess({
                    href: function() {
                        return '#!/auth/login';
                    }
                }, null, {name: '', public: true}, null);

                // THEN it should return expected return code
                expect(status).toBeFalsy();

                // AND no redirect is made (as no runtime error occurs due to missing "go" method)
            });

            it('restricted views can be accessed only authenticated user', function() {
                var route;

                // GIVEN unauthenticated user wants to view restricted page
                // WHEN validating access to the view
                var status = userService.canAccess({
                    href: function() {
                        return '#!/main';
                    },
                    go: function(_route) {
                        route = _route;
                    }
                }, {
                    preventDefault: function() {}
                }, {name: '', public: false}, null);

                // THEN access is denied and redirect to login page occurs
                expect(status).toBeFalsy();
                expect(route).toEqual('auth.login');
            });
        });
    });

})(define, describe);
