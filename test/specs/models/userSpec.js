define([
    'utils/models/user'
], function(UserModel) {

    describe('UserModel', function() {

        it('supports setLoginData', function() {

            // GIVEN User object receives authentication details from backend
            var user = new UserModel();
            user.setLoginData();

            // WHEN quering authentication status
            var status = user.isAuthenticated();

            // THEN it should succeed
            expect(status).toBeTruthy();
        });

        it('supports isAuthenticated', function() {

            // GIVEN unauthenticated User object
            var user = new UserModel();

            // WHEN quering authentication status
            var status = user.isAuthenticated();

            // THEN it should fail
            expect(status).toBeFalsy();
        });
    });
});
