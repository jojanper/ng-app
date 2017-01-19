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

        describe('Login directive', function() {

            var element = '<dng-login></dng-login>';

            AppTestUtils.appTestSetup.call(this, element);

            it('should display login form', function() {
                // 2 inputs are present
                expect(this.$element.find('app-input').length).toEqual(2);

                // Username and password must be present, show as warnings to user
                var el = this.$element.find('.form-input-error');
                expect(el.length).toEqual(2);
                for (var i = 0; i < el.length; i++) {
                    expect(ng.element(el[i]).text()).toEqual('Required!');
                }

                // User is not authenticated
                expect(this.$elementScope.isAuthenticated()).toBeFalsy();

                // No sign-in button available
                expect(this.$element.find('button').hasClass('ng-hide')).toBeTruthy();
            });

            it('user types username and password', function() {
                // GIVEN login form

                // WHEN user types username
                setInput.call(this, 0, 'test');
                this.$timeout.flush();

                // THEN username input is ok
                var el = this.$element.find('.form-input-error');
                expect(ng.element(el[0]).hasClass('ng-hide')).toBeTruthy();
                expect(this.$elementScope.user.username).toEqual('test');

                // AND password input is still pending data
                expect(ng.element(el[1]).hasClass('ng-hide')).toBeFalsy();
                expect(this.$elementScope.user.password).toEqual('');

                // AND sign-in is not possible
                expect(this.$element.find('app-form').scope().$$childTail.canSubmit()).toBeFalsy();

                // -----

                // WHEN user types password
                setInput.call(this, 1, 'password');

                // THEN username input is still ok
                var el = this.$element.find('.form-input-error');
                expect(ng.element(el[0]).hasClass('ng-hide')).toBeTruthy();
                expect(this.$elementScope.user.username).toEqual('test');

                // AND password input is ok too
                expect(ng.element(el[1]).hasClass('ng-hide')).toBeTruthy();
                expect(this.$elementScope.user.password).toEqual('password');

                // AND sign-in is possible
                expect(this.$element.find('app-form').scope().$$childTail.canSubmit()).toBeTruthy();
            });

            it('user clicks sign-in button', function() {
                // GIVEN username and password are available in sign-in form
                setInput.call(this, 0, 'test');
                setInput.call(this, 1, 'password');
                this.$timeout.flush();

                // WHEN user clicks sign-in button
                AppTestUtils.ngClick(this.$element.find('button')[0], this.$scope);

                // THEN user has authenticated itself
                expect(this.$elementScope.isAuthenticated()).toBeTruthy();
            });
        });
    });

})(define, describe);
