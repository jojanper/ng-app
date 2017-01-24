define([
    'utils/models/user'
], function(UserModel) {

    describe('UserModel', function() {

        it('supports setLoginData', function() {

            // GIVEN User object receives authentication details from backend
            var user = new UserModel();
            user.setLoginData({id: 1, email: 'test@gmail.com'});

            // WHEN quering authentication status
            var status = user.isAuthenticated();

            // THEN it should succeed
            expect(status).toBeTruthy();
        });

        it('supports reset', function() {

            // GIVEN authenticated user
            var user = new UserModel().setLoginData({
                id: 1,
                display: 'test user'
            });
            expect(user.isAuthenticated()).toBeTruthy();

            // WHEN user object is reset
            user.reset();

            // THEN user is no longer authenticated
            expect(user.isAuthenticated()).toBeFalsy();
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
