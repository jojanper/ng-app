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

            AppTestUtils.appTestSetup.call(this, element);

            it('should display form', function() {
                // 3 inputs are present
                expect(this.$element.find('app-input').length).toEqual(3);

                // Password field must be present, show as warnings to user
                var el = this.$element.find('.form-input-error');
                expect(el.length).toEqual(4);
                for (var i = 0; i < el.length - 1; i++) {
                    expect(ng.element(el[i]).text()).toEqual('Required!');
                }
                expect(ng.element(el[i]).text()).toEqual('Password not same');

                // No sign-in button available
                expect(this.$element.find('button').hasClass('ng-hide')).toBeTruthy();
            });

            it('passwords are not the same', function() {
                // GIVEN login form

                // WHEN user types new password
                setInput.call(this, 1, 'test');

                // THEN new password input is ok
                var el = this.$element.find('.form-input-error');
                expect(ng.element(el[1]).hasClass('ng-hide')).toBeTruthy();
                expect(this.$elementScope.user.password).toEqual('test');

                // AND 2nd password indicates error
                expect(ng.element(el[3]).text()).toEqual('Password not same');

                // -----

                // WHEN 2nd password is entered
                setInput.call(this, 2, 'test');

                // THEN it should succeed with no errors
                el = this.$element.find('.form-input-error');
                expect(ng.element(el[2]).hasClass('ng-hide')).toBeTruthy();
                expect(this.$elementScope.user.password2).toEqual('test');

                // -----

                // WHEN changing 1st password
                setInput.call(this, 1, 'password');

                // THEN error is displayed for the 2nd password
                el = this.$element.find('.form-input-error');
                expect(ng.element(el[3]).hasClass('ng-hide')).toBeFalsy();
                expect(ng.element(el[3]).text()).toEqual('Password not same');

                // AND submit button is to available
                expect(this.$element.find('app-form').scope().$$childTail.canSubmit()).toBeFalsy();

                // -----

                // WHEN all password fields are correctly set
                setInput.call(this, 0, 'password');
                setInput.call(this, 2, 'password');

                // THEN submit button is available
                expect(this.$element.find('app-form').scope().$$childTail.canSubmit()).toBeTruthy();
            });
        });
    });

})(define, describe);
