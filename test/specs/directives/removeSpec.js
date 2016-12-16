(function(define, describe) {
    "use strict";

    var dependencies = [
        'bootstrap'
    ];

    define(dependencies, function(AppBootstrap) {

        var appName = 'app';

        describe('RemoveOnClick directive', function() {

            var $scope, $element;
            var elementBody = 'Remove me';

            beforeEach(module(appName));

            beforeEach(function(done) {

                inject(function($rootScope, $compile) {

                    // Instantiate directive.
                    var element = '<remove-on-click close-speed="20">' + elementBody + '</remove-on-click>';

                    var obj = AppTestUtils.ngCompileElement($rootScope, $compile, element);
                    $scope = obj.$scope;
                    $element = obj.$element;

                    AppTestUtils.ngClick($element[0], $scope);

                    setTimeout(function() {
                        done();
                    }, 400);
                });
            });

            afterEach(function() {
                $scope.$destroy();
            });

            it('disappear on click', function(done) {

                // GIVEN removable element

                // WHEN element is clicked

                // THEN element should disappear
                var html = $($element[0]).html();
                expect(html).not.toEqual(elementBody);
                expect(html).toEqual('');

                done();
            });
        });
    });

})(define, describe);
