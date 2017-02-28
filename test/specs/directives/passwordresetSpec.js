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
                // GIVEN user email
                var input = this.$element.find('input');
                ng.element(input[0]).val('test@test.com');
                input.trigger('input');

                // WHEN reset button is clicked
                AppTestUtils.ngClick(this.$element.find('button')[0], this.$scope);

                // THEN it should succeed
                // TODO: Make backend call and show response as alert message
            });
        });
    });

})(define, describe);
