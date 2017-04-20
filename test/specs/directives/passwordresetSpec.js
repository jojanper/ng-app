(function(define, describe) {
    "use strict";

    var dependencies = [
        'angular',
        'bootstrap',
    ];

    define(dependencies, function(ng, AppBootstrap) {

        describe('PasswordReset directive', function() {

            var element = '<dng-password-reset></dng-password-reset>';

            AppTestUtils.appTestSetup.call(this, element);

            it('initializes correctly', function() {
                expect(this.$element.find('input').length).toEqual(1);
            });

            it('password reset is requested', function() {
                this.$httpBackend.whenPOST('/api/auth/password-reset').respond(200);

                // GIVEN user email
                var input = this.$element.find('input');
                ng.element(input[0]).val('test@test.com');
                input.trigger('input');
                this.$timeout.flush();

                // WHEN reset button is clicked
                AppTestUtils.ngClick(this.$element.find('button')[0], this.$scope);
                this.$httpBackend.flush();

                // THEN it should succeed
                var messages = this.appMessagesService.getMessages();
                expect(messages.length).toEqual(1);
                var msg = 'Please check your email how to proceed with the password reset';
                expect(messages[0].msgBody).toEqual(msg);
            });
        });

        describe('PasswordResetChange directive', function() {
            var element = '<dng-password-reset-change></dng-password-reset-change>';

            AppTestUtils.appTestSetup.call(this, element, function() {
                this.$state.params.uidb = 'MQ';
                this.$state.params.token = 'abc';
                spyOn(this.$state, 'go').and.callThrough();
            });

            it('new password is activated', function() {

                this.$httpBackend.whenPOST('/api/auth/password-reset-confirm').respond(200, '');

                // GIVEN new password is set by user
                var input = this.$element.find('input');
                ng.element(input[0]).val('password');
                ng.element(input[1]).val('password');
                input.trigger('input');

                // WHEN submit button is clicked
                AppTestUtils.ngClick(this.$element.find('button')[0], this.$scope);
                this.$httpBackend.flush();

                // THEN user is redirected to home page
                expect(this.$state.go).toHaveBeenCalledWith('home');

                // AND success message is shown to user
                var messages = this.appMessagesService.getMessages();
                expect(messages.length).toEqual(1);
                expect(messages[0].msgBody).toEqual('You can now sign-in with your new password');
            });
        });
    });

})(define, describe);
