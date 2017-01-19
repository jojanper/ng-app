(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        describe('User management service', function() {

            var loginApi = '/api/generic/login';

            beforeEach(module('app'));

            var userService, $httpBackend, $location;

            beforeEach(function() {
                inject(function(_dngUserMgr_, _$httpBackend_, _$location_) {
                    userService = _dngUserMgr_;
                    $httpBackend = _$httpBackend_;
                    $location = _$location_;
                });
            });

            it('supports user login', function() {

                spyOn($location, 'path').and.callThrough();
                $httpBackend.whenPOST(loginApi).respond(200);

                // GIVEN user credentials
                var username = 'test';
                var password = 'test';

                // WHEN user does successful login
                userService.login(loginApi, username, password);
                $httpBackend.flush();

                // THEN user is authenticated
                expect($location.path).toHaveBeenCalledWith('/');
            });
        });
    });

})(define, describe);
