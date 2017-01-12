define([
    'utils/models/user'
], function(UserModel) {

    describe('UserModel', function() {

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
