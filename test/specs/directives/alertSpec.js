(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        describe('AppAlert directive', function() {

            var msgRemoved = false;

            // Instantiate directive.
            var element = '<app-alert alert-type="error" msg-body="This is alert message"></app-alert>';
            AppTestUtils.appTestSetup.call(this, element, function(scope) {
                scope.$parent.$on("remove-app-message", function(event, message) {
                    msgRemoved = true;
                });
            });

            beforeEach(function(done) {
                AppTestUtils.ngClick(this.$element.find('remove-on-click')[0], this.$scope);

                setTimeout(function() {
                    done();
                }, 300);
            });

            afterEach(function() {
                this.$scope.$destroy();
            });

            it('disappears on click', function(done) {

                // GIVEN alert message

                // WHEN message is removed

                // THEN element should disappear
                expect(this.$element.text()).toEqual('');
                expect(msgRemoved).toBeTruthy();

                done();
            });
        });
    });

})(define, describe);
