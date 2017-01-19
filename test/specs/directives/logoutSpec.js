(function(define, describe) {
    "use strict";

    var dependencies = [
        'angular',
        'bootstrap',
    ];

    define(dependencies, function(ng, AppBootstrap) {

        describe('Logout directive', function() {

            var element = '<dng-logout></dng-logout>';

            AppTestUtils.appTestSetup.call(this, element, function() {
                spyOn(this.$location, 'path').and.callThrough();
            }, null, null, function() {
                AppTestUtils.login();
            });

            it('user performs sign-out', function() {

                // GIVEN logout page
                // WHEN user performs sign-out

                // THEN user is redirected to login page
                expect(this.$location.path).toHaveBeenCalledWith('/login');

                // AND user is no longer authenticated
                expect(this.$rootScope.user).toEqual(null);
            });
        });
    });

})(define, describe);
