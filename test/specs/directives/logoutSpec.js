(function(define, describe) {
    "use strict";

    var dependencies = [
        'angular',
        'bootstrap',
    ];

    define(dependencies, function(ng, AppBootstrap) {

        describe('Logout directive', function() {

            var signout = false;
            var element = '<dng-logout></dng-logout>';

            AppTestUtils.appTestSetup.call(this, element, function() {
                spyOn(this.$state, 'go').and.callThrough();
                this.$httpBackend.whenPOST('/api/auth/logout').respond(200);
            }, null, null, function() {
                AppTestUtils.login(function() {
                    signout = true;
                });
            });

            it('user performs sign-out', function() {

                // GIVEN logout page
                // WHEN user performs sign-out
                this.$httpBackend.flush();

                // THEN user is redirected to login page
                expect(this.$state.go).toHaveBeenCalledWith('auth.login');

                // AND user is no longer authenticated
                expect(signout).toBeTruthy();
            });
        });
    });

})(define, describe);
