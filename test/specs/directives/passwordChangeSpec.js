(function(define, describe) {
    "use strict";

    var dependencies = [
        'angular',
        'bootstrap',
    ];

    define(dependencies, function(ng, AppBootstrap) {

        function setInput(inputIndex, text) {
            var input = ng.element(this.$element.find('input')[inputIndex]);
            input.val(text);
            input.trigger('input');
        }

        describe('PasswordChange directive', function() {

            var element = '<dng-password-change></dng-password-change>';

            AppTestUtils.appTestSetup.call(this, element, function() {
                spyOn(this.$state, 'go').and.callThrough();
            }, null, null, function() {
                AppTestUtils.login();
            });

            it('should display change form', function() {
                // 3 inputs are present
                expect(this.$element.find('app-input').length).toEqual(3);

                // Password fields must be present, show as warnings to user
                var el = this.$element.find('.form-input-error');
                expect(el.length).toEqual(4);
                for (var i = 0; i < el.length - 1; i++) {
                    expect(ng.element(el[i]).text()).toEqual('Required!');
                }
                expect(ng.element(el[i]).text()).toEqual('Password not same');

                // User is authenticated
                expect(this.$elementScope.isAuthenticated()).toBeTruthy();

                // No password change button available
                expect(this.$element.find('button').hasClass('ng-hide')).toBeTruthy();
            });

            it('user clicks sign-in button', function() {
                this.$httpBackend.whenPOST('/api/auth/password-change').respond(200);

                // GIVEN username and password are available in sign-in form
                setInput.call(this, 0, 'old_password');
                setInput.call(this, 1, 'new_password');
                setInput.call(this, 2, 'new_password');
                this.$timeout.flush();

                // WHEN user clicks password change button
                AppTestUtils.ngClick(this.$element.find('button')[0], this.$scope);
                this.$httpBackend.flush();

                // THEN user is redirected to home page
                expect(this.$state.go).toHaveBeenCalledWith('home');

                // AND success message is shown is user
                var messages = this.appMessagesService.getMessages();
                expect(messages.length).toEqual(1);
                expect(messages[0].msgBody).toEqual('Your password has been changed');
            });
        });
    });

})(define, describe);
