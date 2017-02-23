(function(define, describe) {
    "use strict";

    var dependencies = [
        'angular',
        'bootstrap',
    ];

    define(dependencies, function(ng, AppBootstrap) {

        describe('Register directive', function() {

            var signout = false;
            var element = '<dng-register></dng-register>';

            AppTestUtils.appTestSetup.call(this, element, function() {
                spyOn(this.$state, 'go').and.callThrough();
            }, null, null, null);

            it('initializes correctly', function() {
                expect(this.$element.find('input').length).toEqual(3);
            });

            it('account is created', function() {
                // GIVEN account information is added by user
                var input = this.$element.find('input');
                ng.element(input[0]).val('test');
                ng.element(input[1]).val('test@test.com');
                ng.element(input[2]).val('password');
                input.trigger('input');

                // WHEN create button is clicked
                AppTestUtils.ngClick(this.$element.find('button')[0], this.$scope);

                // THEN user is redirected to home page
                expect(this.$state.go).toHaveBeenCalledWith('home');
            });
        });
    });

})(define, describe);
