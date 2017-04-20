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
    });

})(define, describe);
